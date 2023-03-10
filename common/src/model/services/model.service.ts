import {
  ActionModel,
  AppModel,
  asArray,
  asSingle,
  ConfigModel,
  DatasourceModel,
  FieldModel,
  FieldsType,
  includesPermission,
  Model,
  ModelType,
  PropOptions,
  ServerActionModel,
  ValidatorModel,
  ViewModel,
  WebActionModel,
  DataViewModel,
  hasKeyField,
  replaceObject,
  isModelType,
  isSingleModelType,
  ViewService,
  simplifyDataToId,
  isString,
  DataOptions,
  Dict,
  FindOptions,
  Permission
} from '../..';
import _, { isArray } from 'lodash';
import { registry } from '../../registry';
import { AnyFieldModel, isLookupField, LookupFieldModel } from '..';

export class ModelService {
  private appModel: AppModel;
  private privateModel: Dict<AppModel>;
  private extendedModels: Dict = {};

  setModel(appModel: AppModel, privateModel?: Dict<AppModel>) {
    this.appModel = appModel;
    this.privateModel = privateModel;

    registry.messageService.init();
  }

  get model() {
    return this.appModel;
  }

  get config(): ConfigModel {
    return this.model.config;
  }

  getUserAppModel(username: string): AppModel {
    if (!username || !this.privateModel?.[username]) return this.appModel;
    const appModel = new AppModel();
    Object.assign(appModel, this.appModel);
    appModel.views = [...appModel.views, ...this.privateModel[username].views];
    // TODO: 필요하면 다른 modelType도 처리
    return appModel;
  }

  findByName<T extends Model>(name: string, modelType: ModelType, modelArray?: T[]): T {
    const models = modelArray ?? this.getAll(modelType);
    return models.find((item) => item.name === name) as T;
  }

  findByLabel<T extends Model>(label: string, modelType: ModelType, modelArray?: T[]): T {
    const models = modelArray ?? this.getAll(modelType);
    return models.find((item) => item.label === label) as T;
  }

  getAll(modelType: ModelType): any[] {
    if (modelType == null) throw new Error(`modelType is null`);
    const all = this.model[modelType];
    if (!all) throw new Error(`${modelType} is not found in model.`);
    return all;
  }

  getModels(modelType: ModelType): Model[] {
    return this.getAll(modelType).filter((model: Model) => !model._isType);
  }

  getTypes(modelType: ModelType): Model[] {
    return this.getAll(modelType).filter((model: Model) => model._isType && !model._abstract);
  }

  get<T extends Model>(name: string, modelType: ModelType, modelArray?: T[], noError?: boolean): T {
    const original = this.findByName(name, modelType, modelArray);
    if (!original)
      if (noError) return undefined;
      else throw new Error(`${modelType} '${name}' is not found.`);

    const extended = this.extend<T>(original, modelType);
    return extended;
  }

  getFromFlatten(name: string, modelType: ModelType) {
    const models = _.flatMap(this.getAll(modelType), (model) => [model, ...(model.children ?? [])]);
    return this.get(name, modelType, models, true);
  }

  /**
   *
   * @param original
   * @param modelType
   * @param force do not use extendedModels cache and do not caches the result.
   * @returns
   */
  extend<T extends Model>(original: T, modelType: ModelType, force = false): T {
    if (!force && original.$extended) return original;

    let extended: T;
    if (!force && original.name && original.$persisted) {
      const modelKey = this.getModelKey(original);
      if (this.extendedModels[modelKey]) {
        extended = this.extendedModels[modelKey];
        if (extended.$extended) {
          return extended;
        } else {
          replaceObject(this.extendedModels[modelKey], { ...original, $extended: true });
        }
      } else {
        extended = { ...original, $extended: true };
        this.extendedModels[modelKey] = extended;
      }
    } else {
      extended = { ...original, $extended: true };
    }
    extended.$modelType ??= modelType;

    if (extended.parent) {
      const main = this.get(extended.parent, modelType);
      const defaultExcludeExtendProperties = ['viewActions', 'listSections'];

      this.mergeModel(main, extended, defaultExcludeExtendProperties.concat(extended.excludeExtendProperties ?? []));
    }

    for (const mixin of extended.mixins ?? []) {
      const parent = this.get<T>(mixin, modelType);

      this.mergeModel<T>(parent, extended);
    }

    if (extended.type) {
      if (extended.type == extended.name) throw new Error(`Model '${extended.name}' has the same type with name.`);

      const type = this.get<T>(extended.type, modelType);
      if (type) this.mergeModel<T>(type, extended, ['hint', 'icon']);
    }

    extended.$extended = true;

    return extended;
  }

  private getModelKey(model: Model) {
    return [model.$modelType, model.name, model.type, model.id].join('|');
  }

  replaceModel(model: Model) {
    if (isSingleModelType(model.$modelType)) {
      this.model[model.$modelType] = model;
    } else if (isModelType(model.$modelType)) {
      const existModel = this.findByName(model.name, model.$modelType);
      if (existModel) {
        if (existModel != model) replaceObject(existModel, model);
        const modelKey = this.getModelKey(model);
        const extendedModel = this.extendedModels[modelKey];
        if (extendedModel) {
          replaceObject(extendedModel, model);
          this.extend(existModel, existModel.$modelType);
        }
      } else {
        this.model[model.$modelType as ModelType].push(model as any);
      }
    }
  }

  removeModels(models: Model[]) {
    for (const model of models) {
      _.remove(this.model[model.$modelType], (existModel: Model) => existModel.name == model.name);
      const modelKey = this.getModelKey(model);
      delete this.extendedModels[modelKey];
    }
  }

  private mergeModel<T extends Model>(parent: T, extended: T, excludes?: string[]) {
    for (const key of Object.keys(parent)) {
      if (excludes?.includes(key)) continue;
      if (key.startsWith('$') || key == 'name' || key.startsWith('_')) continue;
      if (this.isPropertyToCombine<T>(extended, parent, key)) {
        const parentElement = parent[key].filter(
          // name으로 extended에 이미 있는 항목 제거
          (element) => !element.name || !this.findByName(element.name, extended.$modelType, extended[key])
        );

        extended[key] = [...parentElement, ...extended[key]];
      } else if (extended[key] === undefined) {
        extended[key] = parent[key];
      }
    }
  }

  private isPropertyToCombine<T extends Model>(child: T, parent: T, key: string) {
    return Array.isArray(child[key]) && parent[key]?.[0] instanceof Object;
  }

  getView<T extends ViewModel = ViewModel>(view?: string): T {
    if (!view) return null;
    const viewModel = this.get<T>(view, 'views');
    if (!viewModel) throw new Error(`View '${view}' is not found.`);

    // const keyField = viewModel.fields?.find((field) => field.name === viewModel.keyField);
    // if (!keyField) console.warn(`View ${view}'s keyField ${viewModel.keyField} is not found in fields.`);

    return viewModel;
  }

  getViews<T extends ViewModel>(): T[] {
    return this.getAll('views')
      .filter((view) => !view._isType && !view._abstract)
      .map((view) => this.extend(view, 'views'));
  }

  getGroupViews(view: ViewModel): ViewModel[] {
    if (!view.viewGroup) return [];
    return this.model.views.filter((otherView) => !otherView._abstract && view.viewGroup == otherView.viewGroup);
  }

  getViewsForSelect(): ViewModel[] {
    const views = _.sortBy(
      this.getViews().map((view) => ({
        name: view.name,
        label: `${view.category}/${view.name}`
      })),
      ['label']
    );
    views.unshift({ name: 'any', label: 'Any' });
    return views;
  }

  getDatasource({ datasource, view }: DataOptions): DatasourceModel {
    if (!datasource && view) {
      const viewModel = this.getView<DataViewModel>(view);
      datasource = viewModel.datasource;
    }
    return this.get(datasource ?? 'default', 'datasources');
  }

  getFields<T extends DataViewModel = DataViewModel>(
    viewModel: T,
    fieldsType?: FieldsType,
    props?: Partial<PropOptions<ViewModel>>,
    includeKeyField = false
  ): FieldModel[] {
    if (!viewModel.fields) return [];
    let fields = viewModel.fields;
    if (fieldsType && viewModel[fieldsType]?.length) {
      const fieldNames = [...(this.callProp(viewModel, fieldsType, props) as string[])];
      if (includeKeyField && viewModel.keyField && !fieldNames.includes(viewModel.keyField))
        fieldNames.push(viewModel.keyField);
      fields = fieldNames.map((fieldName) => {
        const field = viewModel.fields.find((field) => field.name === fieldName);
        if (!field)
          throw new Error(
            `${fieldsType} '${fieldName}' is not found in ${
              viewModel.name ?? viewModel.parent
            }'s fields(${viewModel.fields.map((field) => field.name).join(', ')}).`
          );
        return field;
      });
    }
    fields = fields.map((field) => {
      return this.configure(field, { ...props, model: undefined, viewModel }, 'fields');
    });
    for (const field of fields) field.column ??= field.name;
    return fields as FieldModel[];
  }

  getFieldMap(view: ViewModel): Dict<FieldModel> {
    const map = {};
    for (const field of this.getFields(view)) {
      map[field.name] = field;
    }
    return map;
  }

  getField(view: ViewModel, fieldName: string): AnyFieldModel {
    const fieldNames = fieldName.split('.');
    let fieldModel = view.fields.find((fieldModel) => fieldModel.name === fieldNames[0]);
    if (fieldNames.length > 1 && isLookupField(fieldModel)) {
      const relatedView = this.getView(fieldModel.relatedView);
      fieldModel = this.getField(relatedView, fieldName.substring(fieldName.indexOf('.') + 1));
      if (!fieldModel) throw new Error(`${fieldNames[1]} field is not found in ${relatedView.name}`);
    }
    fieldModel = this.extend(fieldModel, 'fields');
    fieldModel.column ??= fieldModel.name;
    return fieldModel;
  }

  getComputedFields(view: string | ViewModel): FieldModel[] {
    const viewModel = typeof view == 'string' ? this.getView(view) : view;
    const fieldModels = this.getFields(viewModel);
    return fieldModels.filter((field) => field.computed);
  }

  getFieldType(fieldName = 'StringField'): FieldModel {
    const fieldType: FieldModel = this.get(fieldName, 'fields');
    if (!fieldType) throw new Error(`Field Type '${fieldName}' cannot be found.`);
    return fieldType;
  }

  getValidates({
    model,
    viewModel,
    viewService,
    data
  }: Partial<PropOptions<FieldModel>>): ((value: string) => Promise<boolean | string>)[] {
    const allValidators: ValidatorModel[] = model.validators?.map((name) => this.getValidator(name)) ?? [];

    if (model.required) allValidators.unshift(this.getValidator('required'));
    if (model.validate) allValidators.push({ validate: model.validate });

    return allValidators.map((validator) => async (value) => {
      data ??= viewService.data;
      value ??= _.get(data, model.name);
      return await this.callProp(validator, 'validate', {
        value,
        data,
        model,
        viewModel,
        registry
      });
    });
  }

  getValidator(validatorName: string): ValidatorModel {
    return this.get(validatorName, 'validators');
  }

  async executeWebAction<T>(action: string | ActionModel, options?: Partial<PropOptions<ActionModel>>): Promise<T> {
    if (!action) return;
    let model: ActionModel;
    let viewModel: DataViewModel = options?.viewModel;
    if (isString(action)) {
      const [viewName, actionName] = action.split('.');
      viewModel = actionName ? this.getView(viewName) : options?.viewModel;
      model = this.getWebAction(viewModel, actionName ?? action);
    } else {
      model = action;
    }
    const selectedData = this.convertActionData(model, options?.selectedData);
    const propOptions = { ...options, selectedData, viewModel };
    if (!propOptions.selectedId && hasKeyField(viewModel)) {
      propOptions.selectedId = isArray(selectedData)
        ? selectedData.map((row) => row[viewModel.keyField])
        : selectedData?.[viewModel.keyField];
    }

    return await this.callProp(model, 'execute', propOptions);
  }

  isAction(mode: 'disabled' | 'hidden' | 'selected', options: Partial<PropOptions<ActionModel>>): boolean {
    const { model } = options;

    if (mode == 'disabled') {
      try {
        options.selectedData = this.convertActionData(model, options.selectedData);
      } catch (e) {
        return true;
      }
    }

    if (model[mode]) {
      return this.callProp(model, mode, options);
    } else return false;
  }

  private convertActionData(actionModel: WebActionModel, data: any) {
    if (actionModel.actionType == 'multiple') {
      if (data == null || data?.length === 0)
        throw new Error(`data is required for multiple web action '${actionModel.name}'.`);
      return asArray(data);
    } else if (actionModel.actionType == 'single') {
      if (data == null || data?.length === 0 || data?.length > 1)
        throw new Error(`single data is required for single web action '${actionModel.name}'.`);
      return asSingle(data);
    }
    return data;
  }

  getWebActions(viewModel: DataViewModel, actionNames: string[], permissions: Permission[]): WebActionModel[] {
    if (!actionNames) return [];

    const availableActions = this.getAvailableWebActions(viewModel);
    const actions = [];
    for (const actionName of actionNames) {
      const actionModel = availableActions.find((action) => action.name == actionName);
      if (!actionModel) throw new Error(`${actionName} is not available webAction`);
      if (actionModel.permission && permissions) {
        if (includesPermission(actionModel.permission, permissions)) actions.push(actionModel.name);
      } else {
        actions.push(actionModel.name);
      }
    }

    return actions.map((action) => this.get(action, 'webActions', availableActions));
  }

  getAvailableServerActions(viewModel: ViewModel) {
    return [...(this.model.serverActions ?? []), ...(viewModel?.serverActions ?? [])];
  }

  getAvailableWebActions(viewModel: ViewModel): WebActionModel[] {
    // TODO: 반복적으로 호출됨. 캐싱 등 성능 개선 필요
    const actions = [
      ...(viewModel?.webActions ?? []),
      ...(viewModel?.serverActions?.map(this.toWebAction) ?? []),
      ...(this.model.webActions ?? []),
      ...(this.model.serverActions?.map(this.toWebAction) ?? [])
    ];

    return actions;
  }

  getWebAction(viewModel: ViewModel, action: string): WebActionModel {
    const availableActions = this.getAvailableWebActions(viewModel);

    return this.get(action, 'webActions', availableActions);
  }

  getServerAction(viewModel: ViewModel, action: string): ServerActionModel {
    const availableActions = this.getAvailableServerActions(viewModel);

    return this.get(action, 'serverActions', availableActions);
  }

  private toWebAction(action: ServerActionModel): WebActionModel {
    return {
      ...action,
      execute: async ({ viewModel, selectedData, selectedId, pageCtx, registry: { uiService, dataService } }) => {
        const message = await dataService.executeAction({
          view: this.getServerView(viewModel),
          action: action.name,
          data: selectedData,
          dataId: selectedId,
          params: pageCtx
        });
        if (message) uiService.notify({ message });
      }
    };
  }

  callProp<T, S extends ViewService = ViewService>(
    model: any,
    propName: string,
    options: Partial<PropOptions<any, S>> = { model, registry }
  ): T {
    const prop = model[propName];
    if (typeof prop == 'function') {
      options = { ...options };

      if (model.$modelType == 'views') {
        options.viewModel = model;
      } else {
        options.viewModel ??= options.viewService?.model;
      }
      options.model ??= model;
      if (propName != 'data') options.data ??= options.viewService?.data;
      if (propName != 'dataId') options.dataId ??= options.viewService?.dataId;
      if (propName != 'pageCtx') options.pageCtx ??= options.viewService?.pageCtx;
      options.registry ??= registry;
      options.route ??= registry.route;
      options.user ??= registry.authService.user;

      try {
        return prop.bind(model)(options);
      } catch (e) {
        console.error(prop);
        console.error(e);
        throw e;
      }
    } else {
      return prop as T;
    }
  }

  configure<M extends Model>(model: M, props: Partial<PropOptions<M>>, modelType: ModelType): M {
    if (!modelType) throw new Error('modelType is required for configure.');
    if (model['__configured']) return model;

    let extended = this.extend(model, modelType);
    if (extended?.configure) {
      this.callProp(extended, 'configure', { ...props });
    }

    if (model.$configureProxy) {
      const result = new Proxy(model['__v_raw'] ?? model, {
        get: (target, key: string) => {
          if (key == '__configured') return true;
          if (key == '$configureProxy') return true;
          if (key == '__v_raw') return undefined; // reactive object(service)에 model이 할당될떄 toRaw되는 것을 방지
          if (Array.isArray(extended[key]) && parent[key]?.[0] instanceof Object) return extended[key];
          if (key.startsWith && key.startsWith('$')) return model[key];
          if (model[key] == null || this.isPropertyToCombine(model, extended, key)) return extended[key];
          else return model[key];
        },

        set: (target, key: string, value) => {
          if (['type', 'parent', 'mixins'].includes(key) && target[key] != value) {
            target[key] = value;
            extended = this.extend(target, modelType);
          } else {
            target[key] = value;
          }
          return true;
        }
      }) as any;
      return result;
    } else {
      return extended;
    }
  }

  getServerView(viewModel: DataViewModel): string {
    viewModel = this.extend(viewModel, 'views');
    if (viewModel.noServer) return null;
    return viewModel.serverView || viewModel.name || viewModel.parent;
  }

  getFindOptions(viewModel: DataViewModel, viewService: ViewService): FindOptions {
    const view = this.getServerView(viewModel);
    if (!view) return null;
    const options: FindOptions = {
      view,
      filter: this.callProp(viewModel, 'filter', { viewService })
    };

    options.params = this.getOptionParams(viewModel, viewService);
    return options;
  }

  getOptionParams(viewModel: DataViewModel, viewService: ViewService): Dict {
    const paramFields = this.callProp<string[]>(viewModel, 'paramFields', { viewService });
    const fields = ['__sort', '__search', ...(paramFields ?? []), ...(viewModel.filterFields ?? [])];
    const params = simplifyDataToId(_.pick(viewService.pageCtx, fields), true);
    return params;
  }

  getLabelField(model: LookupFieldModel): string {
    const relatedView = this.getView<DataViewModel>(model.relatedView);
    return model.labelField ?? relatedView.labelField ?? 'name';
  }

  getFormattedValue(viewModel: ViewModel, field: string | AnyFieldModel, data: any): string {
    if (isString(field)) field = this.getField(viewModel, field);
    const value = _.get(data, field.name);

    return (
      this.callProp(field, 'valueFormatter', {
        viewModel: viewModel,
        value,
        data: data
      }) ?? value
    );
  }
  getCategories(): any {
    return this.model.categories;
  }
}
