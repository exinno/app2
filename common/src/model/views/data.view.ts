import { Dict, Filter, Join, OrderBy, Select, UndoService, Serializer, Permission } from 'index';
import { SubscriptionLike } from 'rxjs';
import {
  asyncPropField,
  dictPropField,
  FieldGroupModel,
  fieldSelectField,
  fieldsSelectField,
  ViewService,
  PropOptions,
  webActionSelectField,
  ViewModel,
  Model,
  ServerPropOptions,
  voidPropField,
  ViewProps
} from '..';
import { Field, View } from '../model.decorator';

export const keyGenerators = ['random'] as const;
export type KeyGenerator = typeof keyGenerators[number];

/** Data view model */
@View({
  name: 'dataViews',
  parent: 'views',
  fieldGroups: [
    {
      label: 'Data options',
      groupFields: [
        'datasource',
        'table',
        'keyGenerator',
        'live',
        'optimisticLock',
        'serverView',
        'noServer',
        'aclByRecord',
        'enableUndo',
        'indexes',
        'joins'
      ]
    },
    {
      label: 'Query options',
      groupFields: [
        'select',
        'includeSelect',
        'orderBy',
        'groupBy',
        'filter',
        'updateFilter',
        'deleteFilter',
        'where',
        'updateWhere',
        'deleteWhere'
      ]
    },
    {
      label: 'Fields',
      groupFields: ['fields', 'fieldGroups', 'extraFieldGroup']
    },
    {
      label: 'Param fields',
      groupFields: ['pageFields', 'pageCtxDefaultData', 'refreshOnFilterChange']
    },
    {
      label: 'Search',
      groupFields: ['searchFields', 'searchPlaceHolder']
    },
    {
      label: 'Special fields',
      groupFields: [
        'keyField',
        'labelField',
        'createdAtField',
        'updatedAtField',
        'updatedByField',
        'createdByField',
        'ownerField',
        'aclField'
      ]
    },
    {
      label: 'Actions',
      groupFields: [
        'viewActions',
        'webActions',
        'serverActions',
        'itemClickAction',
        'itemDbClickAction',
        'hideActionLabel',
        'viewActionsOn'
      ]
    },
    {
      label: 'Server hooks',
      groupFields: [
        'afterFind',
        'afterGet',
        'beforeCreate',
        'afterCreate',
        'beforeUpdate',
        'afterUpdate',
        'beforeRemove',
        'afterRemove',
        'beforeSave',
        'afterSave'
      ]
    },
    {
      label: 'Data',
      groupFields: ['defaultData', 'data', 'dataId']
    }
  ],
  columnFields: ['name', 'label', 'type', 'acl', 'category', 'owner', 'datasource', 'table']
})
export class DataViewModel<S extends DataViewService = any> extends ViewModel<S> {
  /** Data source for connecting a database with tables */
  @Field({
    type: 'LookupField',
    relatedView: 'datasources',
    labelField: 'name',
    filter: { field: 'name', operator: 'ne', value: 'model' },
    actions: ['openLookupAdd']
  })
  datasource?: string;

  /** Name of the database table used in view. Best to sync view fields and its table column.
   *  There will be an error if table does not have particular column that view fields have.
   *  To solve this, user need to sync table column and view fields.
   *  User with right permission can run 'updateSchema' in 'Screen' screen when there is update or creation in fields.
   *  Changes or creation made in designer automatically update or insert to database upon saving. */
  @Field({
    type: 'SelectField',
    keyField: 'name',
    labelField: 'name',
    allowInputText: true,
    optionItems: ({ registry: { dataService }, data }) =>
      dataService.getTables({ datasource: data.datasource.name ?? data.datasource }),
    onChange: async ({ registry: { dataService, uiService }, data }) => {
      if (!data.table) return;

      let confirmed = true;
      if (data.fields?.length)
        confirmed = await uiService.confirm({
          message: 'Do you want to initialize a field as a table columns?',
          icon: 'mdi-table-column'
        });
      if (confirmed)
        data.fields = await dataService.getFieldsByTable({
          datasource: data.datasource.name ?? data.datasource,
          table: data.table
        });
    },
    validate: ({ data, value }) => {
      return (
        data.noServer ||
        !!value ||
        // TODO: check data view model
        !['DataGridView', 'FormView', 'PivotView'].includes(data.type) ||
        'If it is not no server, a table must be specified.'
      );
    }
  })
  table?: string;

  /** Index defined in view model will be added to the table upon creating.
   *  A default index name using the columns is used unless name is specified. */
  @Field({
    type: 'PropField',
    propType: 'IndexOptions[]'
  })
  indexes?: IndexOptions[];

  /** Only fields listed in select property in view model will be shown on the page.
   *  Users can also define aggregation function ('sum', 'max', 'min', 'avg', 'count') in select property to get values accordingly.
   *  Need to add groupBy property, if using aggregation function.
   *  View's select property will have no effect if request has predefined select property.
   *  Working case = direct API call(?). */ //TODO no effect when options.select, options.$select
  @Field({
    type: 'PropField',
    propType: '(string | Select)[] | ((options: ServerPropOptions) => (string | Select)[])'
  })
  select?: (string | Select)[] | ((options: ServerPropOptions) => (string | Select)[]);

  /** View with includeSelect property will select additional fields within view regardless of other predefined select property.
   *  Field in includeSelect property does not have to be listed in view's fields as long as it's indicated in view's database.*/
  @Field({
    type: 'PropField',
    propType: '(string | Select)[] | ((options: ServerPropOptions) => (string | Select)[])'
  })
  includeSelect?: (string | Select)[] | ((options: ServerPropOptions) => (string | Select)[]);

  /** Filter applied to find on the web(client) side */
  @Field({
    type: 'PropField',
    propType: 'Filter | ((options: PropOptions<any>) => Filter)'
  })
  filter?: Filter | Dict | (<T extends this>(options: PropOptions<T>) => Filter | Dict);

  /** Filter applied to find, remove, and update on the server side */
  @Field({
    type: 'PropField',
    propType: 'Filter | Dict | ((options: ServerPropOptions) => Filter | Dict)'
  })
  serverFilter?: Filter | Dict | ((options: ServerPropOptions) => Filter | Dict);

  /** Update filter property in view model will be applied as a filter to view upon updating the view. */
  @Field({
    type: 'PropField',
    propType: 'string | ((options: ServerPropOptions) => Filter)'
  })
  updateFilter?: Filter | ((options: ServerPropOptions) => Filter);

  /** DeleteFilter property in view model will be applied as a filter to view upon removing data in view.
   *  If deleteFilter property is not defined in view model, then filter property will be applied if there is any. .*/
  @Field({
    type: 'PropField',
    propType: 'string | ((options: ServerPropOptions) => Filter)'
  })
  deleteFilter?: Filter | ((options: ServerPropOptions) => Filter);

  /** Where Property in view model will be applied as a where clause of the view upon updating, removing and finding.
   *  It should be written as SQL where query.
   *  If deleteWhere property or updateWhere property is not defined in view model, then where property will be applied if there is any. */
  @Field({
    type: 'PropField',
    propType: 'string | ((options: ServerPropOptions) => string)'
  })
  where?: string | ((options: ServerPropOptions) => string);

  /** UpdateWhere Property in view model will be applied as a where clause of the view upon updating.
   *  It should be written as SQL where query.
   *  If updateWhere property is not defined in view model, then where property will be applied if there is any. */
  @Field({
    type: 'PropField',
    propType: 'string | ((options: ServerPropOptions) => string)'
  })
  updateWhere?: string | ((options: ServerPropOptions) => string);

  /** DeleteWhere Property in view model will be applied as a where clause of the view upon removing.
   *  It should be written as SQL where query.
   *  If deleteWhere property is not defined in view model, then where property will be applied if there is any. */
  @Field({
    type: 'PropField',
    propType: 'string | ((options: ServerPropOptions) => string)'
  })
  deleteWhere?: string | ((options: ServerPropOptions) => string);

  /** OrderBy property in view model will be applied as an order by clause of the view upon finding. //TODO no effect when options.$orderby
   *  It will arrange in ascending order if direction is not specified. */
  @Field({
    type: 'PropField',
    propType: 'OrderBy[] | ((options: ServerPropOptions) => OrderBy[])'
  })
  orderBy?: OrderBy[] | ((options: ServerPropOptions) => OrderBy[]);

  /** GroupBy property in view model will be applied as a group by clause of the view upon finding. //TODO no effect when check options.$apply
   *  If aggregation function is used in select property, groupBy property should also be added. */
  @Field({
    type: 'PropField',
    propType: 'string[] | ((options: ServerPropOptions) => string[])'
  })
  groupBy?: string[] | ((options: ServerPropOptions) => string[]);

  /** Joins property in view model will be applied as a join clause of the view upon finding.
   *  Users can choose to use on query or raw query to define join.
   *  Only applied when join property is defined in view model and request does not exclude relation.  //TODO no effect when options.joins
   *  In on clause, type is set to 'left join' if join type is not specified.
   *  if params is not defined on join property, then it uses pageCtx (parameter) from request. */
  @Field({
    type: 'PropField',
    propType: 'Joins[] | ((options: ServerPropOptions) => Joins[])'
  })
  joins?: Join[] | ((options: ServerPropOptions) => Join[]);

  /** Key field is a name of a record that holds unique data which identifies that record from all the other records in the file or database.
   *  The value of key field in view should be same as actual primary key name used in database. */
  @Field(fieldSelectField) keyField?: string;

  /** Value of labelField property is name representing label in view. */
  @Field(fieldSelectField) labelField?: string;

  /** Value of createdAtField property is name of the field in view model which identifies when was the record created.
   *  The value of createdAtField property in view should be same as created_at name used in database. */
  @Field(fieldSelectField) createdAtField?: string;

  /** Value of updatedAtField property is name of the field in view model which identifies when was the record updated.
   *  The value of updatedAtField property in view should be same as updated_at name used in database. */
  @Field(fieldSelectField) updatedAtField?: string;

  /** Value of updatedByField property is name of the field in view model which identifies who updated record.
   *  The value of updatedByField property in view should be same as updated_by name used in database. */
  @Field(fieldSelectField) updatedByField?: string;

  /** Value of createdByField property is name of the field in view model which identifies who created record.
   *  The value of createdByField property in view should be same as created_by name used in database. */
  @Field(fieldSelectField) createdByField?: string;

  /** Value of ownerField property is name representing owner in view. */
  @Field(fieldSelectField) ownerField?: string;

  @Field(fieldSelectField) groupField?: string;

  /** AclField property in view can be used as a predefined acl used in record acl and also used as retrieving acls.
   *  When view is not defined in acl, or if record does not have corresponding acl then acl field is used as a manner to check records have permissions or not.
   * TODO no effect if isModelType(objectType) && existObjectAcl check
   * */
  @Field(fieldSelectField) aclField?: string;

  /** WebAction to run when item click */
  @Field(webActionSelectField) itemClickAction?: string;

  /** WebAction to run when item double click */
  @Field(webActionSelectField) itemDbClickAction?: string;

  /** Whether to renew the data of the UI in real-time
   *  Default value is false.
   */
  @Field() live?: boolean = false;

  @Field() livePrepend?: boolean = true;

  @Field({ type: 'SelectField', optionItems: ({ registry: { modelService } }) => modelService.getViewsForSelect() })
  serverView?: string;

  /** Whether it only works with client side data . When the default value is false, it is linked to the server view as the name of the view model. */
  @Field() noServer?: boolean = false;

  /** Whether view allows optimistic lock or not. When it's true, upon updating record in view, it compares record's updated date (updatedAtField) in database and
   *  updated date of the record it loaded. If updated date of record loaded does not match with updated date in database, it throws an updating error.
   *  Error would be due to someone else already updated the record and you have not reflected.
   *  User should consider refreshing the page to solve error. (refresh will reflect latest date of record updated)
   *  Consider setting live field false when using optimisticLock property. */
  @Field() optimisticLock?: boolean = false;

  /** Whether view allows records to have permissions or not.
   *  Record acl overrides view acl, meaning user with no permission to view could still read, edit, add, delete the record if user has acl on record.
   *  Record acl can be set by clicking 'share record' button in ellipsis(⋮) after selecting single record.
   *  Only User with permission to 'share record' button can set principals to record. */
  @Field() aclByRecord?: boolean = false;

  /** Whether view allows to use undo and redo in detail view. Undo is used to reverse the last one or more typed in detail view.
   *  Can find undo button by clicking ellipsis(⋮) in detail view.
   *  Shortcut key of undo is "Ctrl+Z" and "Ctrl+Y" for redo. */
  @Field() enableUndo?: boolean = false;

  /** Using predefined generator to generates key for ID.
   *  New key is generated when inserting a new record and no ID is defined. */
  @Field({ type: 'SelectField', optionItems: keyGenerators })
  keyGenerator?: KeyGenerator;

  /** It sets model's default data upon creating. */
  @Field(dictPropField)
  defaultData?: Dict | (<T extends this>(options: PropOptions<T>) => Dict);

  @Field(dictPropField)
  serverDefaultData?: Dict | ((options: ServerPropOptions) => Promise<Dict>);

  /** Expected callback in view model to be called after find method. (Find method looks for single or multiple value) */
  @Field(asyncPropField)
  afterFind?: (options: ServerPropOptions) => Promise<void>;

  /** Expected callback in view model to be called after get method. (Get method looks for single value)*/
  @Field(asyncPropField)
  afterGet?: (options: ServerPropOptions) => Promise<void>;

  /** Expected callback in view model to be called before create method. */
  @Field(asyncPropField)
  beforeCreate?: (options: ServerPropOptions) => Promise<void>;

  /** Expected callback in view model to be called after create method. */
  @Field(asyncPropField)
  afterCreate?: (options: ServerPropOptions) => Promise<void>;

  /** Expected callback in view model to be called before update method. */
  @Field(asyncPropField)
  beforeUpdate?: (options: ServerPropOptions) => Promise<void>;

  /** Expected callback in view model to be called after update method. */
  @Field(asyncPropField)
  afterUpdate?: (options: ServerPropOptions) => Promise<void>;

  /** Expected callback in view model to be called before remove method. */
  @Field(asyncPropField)
  beforeRemove?: (options: ServerPropOptions) => Promise<void>;

  /** Expected callback in view model to be called after remove method. */
  @Field(asyncPropField)
  afterRemove?: (options: ServerPropOptions) => Promise<void>;

  /** Expected callback in view model to be called before save, create and update method. */
  @Field(asyncPropField)
  beforeSave?: (options: ServerPropOptions) => Promise<void>;

  /** Expected callback in view model to be called after save, create and update method. */
  @Field(asyncPropField)
  afterSave?: (options: ServerPropOptions) => Promise<void>;

  /** Expected callback to be called on submit of action or form. */
  @Field(voidPropField)
  onSubmitted?: <T extends this>(options: PropOptions<T>) => void;

  @Field({
    type: 'PropField',
    propType: '(options: PropOptions<any>) => Permission[]'
  })
  addWebActionPermissions?: <T extends this>(options: PropOptions<T>) => Permission[];

  @Field({
    type: 'PropField',
    propType: '(options: PropOptions<any>) => Permission[]'
  })
  hasGroupPermission?: <T extends this>(options: PropOptions<T>) => boolean;

  @Field({
    type: 'PropField',
    propType: '(options: PropOptions<any>) => Permission[]'
  })
  hasOwnerPermission?: <T extends this>(options: PropOptions<T>) => boolean;

  @Field()
  includePermissions?: boolean;

  /** Is used to search records. User can search by putting value in search box and press enter or click on search button.
   *  It will search through record with corresponding value in the field.
   *  Search bar will not appear on view if searchFields does not exist on view model. */
  @Field(fieldsSelectField)
  searchFields?: string[];

  @Field()
  searchPlaceHolder?: string;

  @Field(fieldsSelectField)
  sortFields?: string[];

  @Field()
  stackLabel?: boolean = true;

  @Field({
    type: 'ModalViewField',
    dataType: 'array' as const,
    icon: 'mdi-group',
    view: {
      parent: 'fieldGroups'
    }
  })
  fieldGroups?: FieldGroupModel[] | null;

  @Field({
    type: 'ModalViewField',
    icon: 'mdi-group',
    view: {
      type: 'FormView',
      parent: 'fieldGroups'
    }
  })
  extraFieldGroup?: FieldGroupModel | null;

  @Field({ type: 'CheckboxField' })
  lazyLoading?: boolean = false;

  @Field()
  serializer?: Serializer;

  /** */
  @Field({
    type: 'PropField',
    propType: 'Dict | Dict[] | (<T extends this>(options: PropOptions<T>) => Dict | Dict[])'
  })
  declare data?: Dict | Dict[] | (<T extends this>(options: PropOptions<T>) => Dict | Dict[]);

  @Field({ type: 'CheckboxField' })
  validateOnLoad?: boolean = false;

  @Field({ type: 'StringField' })
  sequenceField?: string;
}

export interface IndexOptions {
  name: string;
  fields: string[];
  indexType?: 'UNIQUE' | 'FULLTEXT' | 'HASH' | 'BITMAP';
}

/** Data view service */
export class DataViewService<T = DataViewModel> extends ViewService<T> {
  constructor(protected props: ViewProps<T>) {
    super(props);
  }

  private _selectedData?: any;

  get selectedData() {
    return this._selectedData ?? this.props.selectedData;
  }

  set selectedData(value: any) {
    this._selectedData = value;
  }

  isNew?: boolean; // TODO: FormView 전용

  subscription?: SubscriptionLike;

  subscriptions?: SubscriptionLike[] = [];

  validate?(): Promise<boolean | undefined>; // TODO: FormView, ScriptView 전용

  submit?(value?: any): void; // TODO: FormView, ScriptView 전용

  unsubscribe() {
    if (this.subscriptions.length) {
      for (const subscription of this.subscriptions) subscription.unsubscribe();
    } else {
      this.subscription?.unsubscribe();
    }
  }

  undoService?: UndoService;
}

export const hasKeyField = (model: any): model is DataViewModel => {
  return model.keyField != null;
};

export function isListableView(model: Model): model is DataViewModel {
  return [
    'DataGridView',
    'ListView',
    'NestedListView',
    'PivotView',
    'TreeView',
    'KanbanView',
    'CalendarView',
    'GanttView',
    'CommentView',
    'AttachmentView',
    'TimelineView'
  ].includes(model.type);
}

export const isSearchableView = (model: any): model is DataViewModel => {
  return isListableView(model) && !!model.searchFields?.length;
};

export const isSortableView = (model: any): model is DataViewModel => {
  return isListableView(model) && !!model.sortFields?.length;
};
