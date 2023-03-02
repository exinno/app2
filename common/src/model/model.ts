import { Dict } from '..';
import { ModelType, PropOptions, ViewModel, ViewService } from '.';
import { Field, View } from './model.decorator';
import { stringPropField, voidPropField } from './predefined.fields';
import { isPlainObject } from 'lodash';

/**
 * Model base class
 */
@View({
  name: 'models',
  type: 'DataGridView',
  _abstract: true,
  datasource: 'model',
  keyField: 'name',
  labelField: 'label',
  includeSelect: [{ field: '$persisted' }],
  aclByRecord: true,
  viewActions: ['openAdd', 'openEdit', 'openRemove', 'openQueryBuilder', 'exportExcel', 'openActivities', 'refresh'],
  serializer: 'js'
})
export class Model<S extends ViewService = ViewService, V extends ViewModel<S> = ViewModel<S>> {
  /** Unique id of the field in view model.
   *  Id of the field is automatically created when new field is made.
   *  Value of the id is created as a form of '(Model Name/Field Name)'. */
  id?: string;

  /** The name of the model used as a key */
  @Field({
    type: 'StringField',
    required: true,
    editable: ({ data }) => !data?.$persisted,
    validate: ({ value, data, viewModel, registry: { modelService } }) => {
      const modelType = (viewModel.table ?? viewModel.serverView) as ModelType;
      return (
        !modelType || data?.$persisted || !modelService.findByName(value, modelType) || 'Model name is duplicated!'
      );
    }
  })
  name?: string;

  /** Label of the model */
  @Field({
    type: 'StringField',
    validate: ({ value, data, viewModel, registry: { modelService } }) => {
      if (!value) return true;
      const modelType = (viewModel.table ?? viewModel.serverView) as ModelType;
      const foundModel = modelService.findByLabel(value, modelType);
      return !modelType || !foundModel || foundModel.name == data.name || 'Model label is duplicated!';
    }
  })
  label?: string | (<T extends this>(options: PropOptions<T, S, V>) => string);

  /** Type of the view. Every view type has its own properties to set.
   *  It is recommended to set type of the view upon creating the model. */
  @Field({
    type: 'SelectField',
    labelField: 'name',
    keyField: 'name',
    iconField: 'icon',
    descriptionField: 'hint',
    required: true,
    optionItems: ({ registry: { modelService }, viewModel }) => modelService.getTypes(viewModel.table as ModelType)
  })
  type?: any;

  /** Set mixins in the view. View that contains methods and properties for use by other view without having to be extended. */
  @Field({
    type: 'SelectField',
    labelField: 'name',
    keyField: 'name',
    optionItems: ({ registry: { modelService }, viewModel }) => modelService.getModels(viewModel.table as ModelType),
    multiple: true
  })
  mixins?: string[];

  /** Parent refers to parent of the view model.
   *  View model with parent inherits properties from parent view model.
   * TODO mixin vs parent
   */
  @Field({
    type: 'SelectField',
    labelField: 'name',
    keyField: 'name',
    optionItems: ({ registry: { modelService }, viewModel }) => modelService.getModels(viewModel.table as ModelType)
  })
  parent?: string;

  /**
   * Extends from parent excluding certain attributes.
   */
  @Field()
  excludeExtendProperties?: string[];

  /** Icon used for view, field, menu and etc. */
  @Field({ type: 'IconField' })
  icon?: string | (<T extends this>(options: PropOptions<T, S, V>) => string);

  /** Description of view and field .
   *  Position of the hint can be set by 'hintMode'(tooltip, button, bottom). */
  @Field(stringPropField)
  hint?: string | (<T extends this>(options: PropOptions<T, S, V>) => string);

  /** Configure
   * TODO */
  @Field(voidPropField)
  configure?: <T extends this>(options: PropOptions<T>) => void;

  /** It defines view's context of current state. */
  methods?: Dict<(...args: any) => any>;

  /** ACL name defining access permission to this model (views, menus, actions, etc.). ACL is defined on the 'ACLs' screen.
   * Additional permissions can be defined on the 'Share View' from each view's ellipsis menu, and this ACL is also included. */
  @Field({
    type: 'SelectField',
    labelField: 'name',
    keyField: 'name',
    optionItems: ({ registry: { dataService } }) => dataService.getAll({ view: 'acls' })
  })
  acl?: string;

  /** Category of view refers to which category does the view belongs to.
   *  If category is not defined, then it define as 'common'. */
  @Field({
    type: 'SelectField',
    allowInputText: true,
    newValueMode: 'add-unique',
    optionItems: ({ registry: { modelService } }) => modelService.getCategories(),
    editable: ({ data }) => !data?.$persisted
  })
  category?: string;

  /** Owner of the view will have full permission on the corresponding view. //TODO working
   *  If owner is not defined on view model, name of the creator will automatically be the owner.
   *  Owner of the record can be assigned, if the view has 'aclByRecord' as true and user has permission to click on share record button. */
  @Field({ type: 'StringField', editable: false })
  owner?: string;

  // Fields starting with _ are not copied on mergeModel(type, parent, mixins)
  @Field({ hidden: true })
  _isType?: boolean;

  @Field({ hidden: true })
  _abstract?: boolean;

  /** Whether to set '$persisted' in view model to true or false.
   *  When $persisted property is true corresponding view name is used upon getting permission of the web actions.
   *  View's parents name is used when its false.
   * TODO check */
  @Field({ type: 'CheckboxField', hidden: true })
  $persisted?: boolean;

  // Fields starting with $ are temporary attributes for processing at runtime, not required when defining the model.
  $configureProxy?: boolean; // Option to preview the original model changes even after configuring the model in viewDesigner.
  $modelType?: ModelType;
  $loadedTime?: number;
  $extended?: boolean;
  $username?: string;
  $ignoreChange?: boolean;
}

export function isModel(model: any): model is Model {
  return isPlainObject(model);
}
