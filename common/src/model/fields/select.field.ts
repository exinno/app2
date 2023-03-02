import { Field, FieldModel, PropOptions, DataViewService, DataViewModel, View } from '..';

/** Select field */
@View({
  name: 'selectField',
  parent: 'fields',
  simpleFormFields: [
    'type',
    'name',
    'label',
    'optionItems',
    'multiple',
    'keyField',
    'labelField',
    'iconField',
    'descriptionField',
    'defaultValue'
  ]
})
export class SelectFieldModel extends FieldModel {
  declare type: 'SelectField';

  name? = 'SelectField';

  icon? = 'mdi-form-dropdown';

  dataType?: 'string' | 'array' = 'string';

  label?: string;

  columnType? = 'string' as const;

  @Field()
  keyField?: string;

  @Field()
  labelField?: string;

  @Field()
  iconField?: string;

  @Field()
  descriptionField?: string;

  /** It defines options available to select in the list. */
  @Field({
    type: 'PropField',
    propType: 'any[] | Promise<any[]> | ((options: PropOptions<SelectFieldModel>) => any[] | Promise<any[]>)'
  })
  optionItems?:
    | readonly any[]
    | any[]
    | Promise<any[]>
    | ((options: PropOptions<this, DataViewService, DataViewModel>) => any | Promise<any>);

  /** Whether to allow selecting more than 1 items.
   *  Defaults to false. */
  @Field({ type: 'CheckboxField' })
  multiple?: boolean = false;

  /** Whether to allow typing text in select list.
   *  Defaults to false. */
  @Field({ type: 'CheckboxField' })
  allowInputText?: boolean = false;

  newValueMode?: 'add' | 'add-unique' | 'toggle' | undefined;

  /** Whether to update model with the value of the selected option instead of the whole option.
   *  Defaults to false. */
  @Field({ type: 'CheckboxField' })
  emitItem?: boolean = false;

  valueFormatter? = (options: PropOptions<this>) => {
    const {
      value,
      model,
      registry: { modelService }
    } = options;
    const optionItems: any[] = modelService.callProp(model, 'optionItems', options);
    const format = (value: any) => {
      if (model.keyField == model.labelField || value == null) return value;
      if (value[model.labelField]) return value[model.labelField]; // emitItem case
      if (!optionItems.find) return value;
      const item = optionItems.find((item) => item[model.keyField] == value);
      return item?.[model.labelField] ?? value;
    };
    if (Array.isArray(value)) {
      return value.map((el) => format(el)).join(', ');
    } else {
      return format(value);
    }
  };
}
