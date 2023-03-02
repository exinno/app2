import {
  ActionOptions,
  DataOptions,
  DatasourceModel,
  Dict,
  FieldModel,
  FieldsType,
  FindOptions,
  FindResult,
  PropOptions,
  randomString,
  registry,
  SaveOptions,
  SqlOptions,
  ViewModel,
  SubscribeOptions
} from '..';
import { SubscriptionLike } from 'rxjs';

export abstract class DataService {
  abstract find<T = Dict>(options: FindOptions<T>): Promise<FindResult<T>>;

  abstract getAll<T = Dict>(options: FindOptions<T>): Promise<T[]>;

  abstract get<T = Dict>(options: FindOptions<T>): Promise<T>;

  abstract count(options: FindOptions): Promise<number>;

  abstract save<T = any>(options: SaveOptions<T>): Promise<number>;

  abstract create<T = any>(options: SaveOptions<T>): Promise<number>;

  abstract update<T = any>(options: SaveOptions<T>): Promise<number>;

  abstract remove(options: SaveOptions): Promise<number>;

  abstract subscribe(options: FindOptions, subscribeOptions: SubscribeOptions): Promise<SubscriptionLike>;

  abstract getTables(options: FindOptions): Promise<Dict[]>;

  abstract getFieldsByTable(options: FindOptions): Promise<FieldModel[]>;

  abstract executeAction(options: ActionOptions): Promise<any>;

  abstract executeSql<T = Dict[]>(options: SqlOptions): Promise<T>;

  abstract updateSchema(options: DataOptions): Promise<void>;

  abstract loadCsv(options: DataOptions): Promise<number>;

  abstract testConnect(datasource: DatasourceModel): Promise<true | string>;

  applyComputed<T extends Dict | Dict[]>(data: T & { $computedApplied?: boolean }, view: string | ViewModel): T {
    const { modelService, callProp } = registry;
    if (data.$computedApplied) return data;
    data.$computedApplied = true;
    const computedFields = modelService.getComputedFields(view);
    for (const row of Array.isArray(data) ? data : [data]) {
      for (const field of computedFields) {
        // TODO: server side에서 computed field가 서로 참조되는 경우 처리 필요
        row[field.name] = callProp(field, 'computed', {
          model: field,
          data: row,
          value: undefined,
          registry
        });
      }
    }
    return data;
  }

  getDefaultData(
    viewOptions: Partial<PropOptions<ViewModel>>,
    options: { withId?: boolean; fieldsType?: FieldsType } = {}
  ): any {
    options.fieldsType ??= 'formFields';

    const { callProp, modelService } = registry;
    const defaultData: any = {};
    const fields = modelService.getFields(viewOptions.model, options.fieldsType);

    fields.forEach((field) => {
      if (field.defaultValue !== undefined)
        defaultData[field.name] = callProp(field, 'defaultValue', { ...viewOptions, model: field });
    });

    Object.assign(
      defaultData,
      callProp(
        viewOptions.model,
        options.fieldsType == 'pageFields' ? 'pageCtxDefaultData' : 'defaultData',
        viewOptions
      )
    );

    if (options?.withId) defaultData.$id = randomString();
    return defaultData;
  }
}
