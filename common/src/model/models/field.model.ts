import { AggFunc, Dict, Encryption, JoinType, Value } from '../..';
import {
  AnyFieldModel,
  Model,
  PropOptions,
  DataViewService,
  DataViewModel,
  LookupFieldModel,
  ServerPropOptions
} from '..';
import { Field, View } from './model.decorator';
import { webActionsSelectField } from './predefined.fields';

export type FieldsType =
  | 'columnFields'
  | 'rowFields'
  | 'valueFields'
  | 'pageFields'
  | 'formFields'
  | 'simpleFormFields'
  | 'searchFields'
  | 'sortFields';

export const dataTypes = ['string', 'number', 'boolean', 'date', 'object', 'array'] as const;
export type DataType = typeof dataTypes[number];

// Ref: https://knexjs.org/guide/schema-builder.html#integer
export const columnTypes = [
  'integer',
  'tinyint',
  'bigint',
  'text',
  'string',
  'float',
  'double',
  'decimal',
  'boolean',
  'date',
  'datetime',
  'time',
  'timestamp',
  'binary',
  'object', // alasql only
  'array' // alasql only
] as const;
export type ColumnType = typeof columnTypes[number];

/**
 * Field model
 */
@View({
  name: 'fields',
  table: 'fields',
  parent: 'models',
  hintMode: 'tooltip',
  fieldGroups: [
    {
      label: 'Model basic',
      groupFields: [
        'name',
        'label',
        'icon',
        'hint',
        'type',
        'mixins',
        'parent',
        'acl',
        'category',
        'owner',
        'configure'
      ],
      defaultOpened: true
    },
    {
      label: 'Data options',
      groupFields: [
        'column',
        'sql',
        'dataType',
        'columnType',
        'columnDefault',
        'notNull',
        'aggFunc',
        'joinType',
        'temporary'
      ]
    },
    {
      label: 'Display options',
      groupFields: [
        'cols',
        'width',
        'height',
        'pinned',
        'hidden',
        'cellStyle',
        'cellClass',
        'allowHtml',
        'componentProps'
      ]
    },
    {
      label: 'Editing options',
      groupFields: [
        'required',
        'editable',
        'creatable',
        'updatable',
        'singleClickEdit',
        'cellEditorAsRender',
        'autofocus'
      ]
    },
    {
      label: 'Value options',
      groupFields: ['defaultValue', 'computed', 'valueFormatter', 'valueParser', 'encryption']
    },
    {
      label: 'Validators and actions',
      groupFields: ['validators', 'validate', 'actions']
    },
    {
      label: 'Web events',
      groupFields: ['onChange', 'onEnter', 'onClick']
    },
    {
      label: 'List field options',
      groupFields: [
        'listFieldHideLabel',
        'listFieldCaption',
        'listFieldHeader',
        'listFieldOverline',
        'listFieldLines',
        'listFieldIconSize',
        'listFieldIconColor'
      ]
    }
  ],
  simpleFormFields: ['type', 'name', 'label', 'defaultValue'],
  columnFields: ['name', 'label', 'type', 'acl', 'category', 'owner', 'dataType']
})
export class FieldModel extends Model {
  /** Field component name registered in uiService */
  component?: string;

  /** Type of the field model in JavaScript. dataType property and columnType property should have similar type. */
  @Field({
    type: 'SelectField',
    optionItems: dataTypes
  })
  dataType?: DataType;

  /** Column name of the DB table. If you do not specify, it is the same as name. */
  @Field()
  column?: string;

  /** Type of the field model in database. ColumnType property and dataType property should have similar type. */
  @Field({
    type: 'SelectField',
    optionItems: columnTypes
  })
  columnType?: ColumnType;

  /** Not null of DB column. It is reflected when creating a table. */
  @Field()
  notNull?: boolean;

  /** Whether field is temporary or not. Fields with temporary property does not exist on database. */
  @Field() temporary?: boolean;

  /** Raw sql query of the field used in select, group by and joins clause.
   *  These are used in find method. */
  @Field({
    type: 'PropField',
    propType: 'string | ((options: ServerPropOptions) => string)'
  })
  sql?: string | Promise<any> | ((options: ServerPropOptions) => string | Promise<any>);

  /** Users can define aggregation function ('sum', 'max', 'min', 'avg', 'count') in select property to get values accordingly.
   *  Should consider to add a groupBy property, if using aggregation function. */
  @Field() aggFunc?: AggFunc;

  /** Users can specify join type in join clause.
   *  Type is set to 'left join' if join is defined but, join type is not specified. */
  @Field() joinType?: JoinType;

  /** It defines horizontal length of the column in fields. */
  @Field({
    type: 'PropField',
    inputField: { type: 'NumberField' },
    propType: 'number | ((options: PropOptions<FieldModel>) => number);'
  })
  cols?: number | ((options: PropOptions<FieldModel>) => number);

  /** Width of the field. Best to include unit (cm, mm, in, px, rem, etc.) when writing in string. */
  @Field() width?: string | number;

  /** Height of the field. Best to include unit (cm, mm, in, px, rem, etc.) when writing in string. */
  @Field() height?: string | number;

  /** Whether field is must needed or optional.
   *  Fields with required property must define value of the field upon creating.
   *  Default to false. */
  @Field({
    type: 'PropField',
    inputField: { type: 'CheckboxField' },
    propType: 'boolean | ((options: PropOptions<FieldModel>) => boolean)'
  })
  required?: boolean | ((options: PropOptions<FieldModel>) => boolean);

  /** Whether field is editable or not.
   *  Fields with editable property as false cannot be edited whether its creating or updating .
   *  Default to true. */
  @Field({
    type: 'PropField',
    inputField: { type: 'CheckboxField' },
    propType: 'boolean | ((options: PropOptions<FieldModel>) => boolean)'
  })
  editable?: boolean | ((options: PropOptions<FieldModel>) => boolean);

  /** Whether field is creatable or not.
   *  Fields with creatable property as false cannot be created.
   *  Default to true. */
  @Field()
  creatable?: boolean;

  /** Whether field is updatable or not.
   *  Fields with updatable property as false cannot edit when creating, but updating.
   *  Default to true.*/
  @Field({
    type: 'PropField',
    inputField: { type: 'CheckboxField' },
    propType: 'boolean | ((options: PropOptions<FieldModel>) => boolean)'
  })
  updatable?: boolean | ((options: PropOptions<FieldModel>) => boolean);

  /** Whether field is hidden or not.
   *  Fields with hidden property as true does not appear on view.
   *  Default to false */
  @Field({
    type: 'PropField',
    inputField: { type: 'CheckboxField' },
    propType: 'boolean | ((options: PropOptions<FieldModel>) => boolean)'
  })
  hidden?: boolean | ((options: PropOptions<FieldModel>) => boolean);

  /** Renders an overline label */
  @Field()
  listFieldOverline?: boolean;

  /** Renders a caption label */
  @Field()
  listFieldCaption?: boolean;

  /** Renders a header label */
  @Field()
  listFieldHeader?: boolean;

  /** Apply ellipsis when there's not enough space to render on the specified number of lines */
  @Field()
  listFieldLines?: number;

  @Field()
  listFieldHideLabel?: boolean;

  @Field()
  listFieldIconSize?: string;

  @Field()
  listFieldIconColor?: string;

  /** Whether field is auto focused or not.
   *  Fields with autofocus property automatically get focus when the page loads.
   *  Default to false.
   * TODO not working*/
  @Field() autofocus?: boolean;

  @Field() allowHtml?: boolean;

  /** Setting cell style of the fields.
   *  Such as 'text-align':'right' (excel like). */
  @Field({
    type: 'PropField',
    propType: 'Dict | string | ((options: PropOptions<FieldModel>) => Dict | string)'
  })
  cellStyle?: Dict | string | ((options: PropOptions<FieldModel>) => Dict | string);

  /** Setting css class of the field cell */
  @Field({
    type: 'PropField',
    propType: 'Dict | string | ((options: PropOptions<FieldModel>) => Dict | string)'
  })
  cellClass?: Dict | string | ((options: PropOptions<FieldModel>) => Dict | string);

  /** Whether view allows to see editor on render.
   *  Need to open edit mode to see the field's editor if a cellEditorAsRender property is false.    */
  @Field() cellEditorAsRender?: boolean;

  /** Whether to allow field as single click edit or not.
   *  If a singleClickEdit property is true, it allows user to enter edit mode with one click on record. */
  @Field() singleClickEdit?: boolean;

  /** Whether to pin the column left or right.
   *  Can pin columns by setting the field either 'left' or 'right'. */
  @Field() pinned?: 'left' | 'right' | ((options: PropOptions<FieldModel>) => 'left' | 'right');

  /** Field with a actions property will have action features when edit mode is on.
   *  There will be ellipsis (⋮) next to the fields with actions available. */
  @Field(webActionsSelectField) actions?: string[];

  /** Allows to set a component property in field.
   *  It uses props to pass data from a parent component to child components. */
  @Field({ type: 'PropField', propType: 'Dict' })
  componentProps?: Dict;

  /** It helps to validate field's value upon creating or updating.
   *  Validators use predefined validation algorithm to validate the value. */
  @Field() validators?: string[];

  /** It sets field's default value upon creating. */
  @Field({
    type: 'PropField',
    propType: 'Value | Dict | Dict[] | ((options: PropOptions<FieldModel>) => Value | Dict | Dict[])'
  })
  defaultValue?: Value | Dict | Dict[] | ((options: PropOptions<FieldModel>) => Value | Dict | Dict[]);

  @Field()
  columnDefault?: Value;

  /** Computed property helps to transform data.
   *  Can access record value through using 'data' parameter as a key of 'options'. */
  @Field({ type: 'PropField', propType: '<T extends this>(options: PropOptions<T>) => any' })
  computed?: <T extends this>(options: PropOptions<T>) => any;

  /** It allows fields to be encrypted. Users can choose predefined type in encryption (bcrypt and aes).
   *  bcrypt = One-way encryption (cannot be decrypted).
   *  aes = Two-way encryption (can be decrypted). */
  @Field({ type: 'SelectField', optionItems: ({ registry: { common } }) => common.encryptions })
  encryption?: Encryption;

  /** Expected callback to be called upon creating or updating field value.
   *  Validate property helps to validate field's value based on validation algorithm. */
  @Field({
    type: 'PropField',
    propType: '(options: PropOptions<FieldModel>) => boolean | string | Promise<boolean | string>',
    cols: 12,
    height: '400px'
  })
  validate?: <T extends this>(
    options: PropOptions<T, DataViewService, DataViewModel>
  ) => boolean | string | Promise<boolean | string>;

  /** Expected callback to be called before showing value in view.
   *  It allows users to format values.*/
  @Field({
    type: 'PropField',
    propType: '(options: PropOptions<FieldModel, DataViewService, DataViewModel>) => string'
  })
  valueFormatter?: <T extends this>(options: PropOptions<T, DataViewService, DataViewModel>) => string;

  /** Expected callback to be called before inserting it into record.
   *  It allows users to parse the value. */
  @Field({ type: 'PropField', propType: '(options: PropOptions<FieldModel, DataViewService, DataViewModel>) => void' })
  valueParser?: <T extends this>(options: PropOptions<T, DataViewService, DataViewModel>) => void;

  /** Expected callback to be called on change of field's value. */
  @Field({ type: 'PropField', propType: '(options: PropOptions<FieldModel, DataViewService, DataViewModel>) => void' })
  onChange?: <T extends this>(options: PropOptions<T, DataViewService, DataViewModel>) => void;

  /** Expected callback to be called on pressing 'Enter' key on keyboard. */
  @Field({ type: 'PropField', propType: '(options: PropOptions<FieldModel, DataViewService, DataViewModel>) => void' })
  onEnter?: <T extends this>(options: PropOptions<T, DataViewService, DataViewModel>) => void;

  /** Expected callback to be called on mouse left-click. */
  @Field({ type: 'PropField', propType: '(options: PropOptions<FieldModel, DataViewService, DataViewModel>) => void' })
  onClick?: <T extends this>(options: PropOptions<T, DataViewService, DataViewModel>) => void;
}

/** Model of field group. */
@View({
  name: 'fieldGroups',
  type: 'DataGridView',
  noServer: true,
  detailView: {
    openType: 'modal',
    type: 'FormView'
  },
  viewActions: ['openAdd', 'openEdit', 'openRemove']
})
export class FieldGroupModel {
  /** Name of field group. key value for replacing parent item when it is merge with parent model */
  @Field() name?: string;

  /** Label of the field group */
  @Field() label?: string;

  /** List of model properties in a group */
  @Field({
    type: 'PropField',
    propType: 'string[]'
  })
  groupFields?: string[];

  /** List of field group model. */
  @Field({
    type: 'ModalViewField',
    dataType: 'array',
    icon: 'mdi-group',
    view: 'fieldGroups'
  })
  groups?: FieldGroupModel[];

  /** Whether to expand the group field upon opening view designer. */
  @Field() defaultOpened?: boolean;

  /** Whether to allow dense mode or not. It helps group fields to occupy less space. */
  @Field() dense?: boolean;

  /** It applies custom classes to the header. */
  @Field() headerClass?: string;
}

export interface RelationField {
  relatedView?: string; // eg. OrderItem
  relatedField?: string; // eg. OrderItem.orderId
  keyField?: string; // eg. Order.id
}

export function isOneToManyField(model: any): model is RelationField & AnyFieldModel {
  // relatedField가 있으면 oneToMany, manyToOne은 relatedView만 있음
  return !!model.relatedView && !!model.relatedField && !model.mappingView;
}

export function isManyToManyField(model: any): model is LookupFieldModel {
  return !!model.relatedView && !!model.mappingView;
}

export function isPhysicalField(field: FieldModel): boolean {
  return (
    isSelectableField(field) &&
    !!field.columnType &&
    !isOneToManyField(field) &&
    !isManyToManyField(field) &&
    !field.sql &&
    !field.name?.includes('.')
  );
}

/** data.service에 select요청할 수 있는 필드인가? (sql query select가 아님) */
export function isSelectableField(field: FieldModel): boolean {
  return field && !!field.name && !!field.dataType && !field.temporary;
}

export interface FieldService {
  beforeSubmit?(): Promise<void> | void;
}

export const getColumnByField = (field: FieldModel) => {
  return field.column ?? field.name;
};
