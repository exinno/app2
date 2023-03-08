import { Filter, Select } from '../..';
import { DataViewModel, Field, FieldModel, PropOptions, RelationField, View } from '..';

/** A field to find and link the data of the related view */
@View({
  name: 'lookupField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'defaultValue', 'relatedView', 'filter', 'orderby', 'multiple']
})
export class LookupFieldModel extends FieldModel implements RelationField {
  declare type: 'LookupField';

  name? = 'LookupField';

  icon? = 'mdi-table-search';

  dataType? = 'string' as const;

  columnType? = 'string' as const;

  @Field()
  keyField?: string;

  @Field()
  labelField?: string;

  @Field({
    type: 'PropField',
    propType: 'Filter | ((options: PropOptions<any>) => Filter)'
  })
  filter?: Filter | (<T extends this>(options: PropOptions<T>) => Filter);

  @Field()
  orderby?: string;

  @Field({
    type: 'PropField',
    propType: 'string | Select)[] | (<T extends this>(options: PropOptions<T>) => (string | Select)[])'
  })
  select?: (string | Select)[] | (<T extends this>(options: PropOptions<T>) => (string | Select)[]);

  newValueMode?: 'add' | 'add-unique' | 'toggle' | undefined;

  /** Used in one to many relations, 'relatedView' must be defined in lookup field.
   *  Related view's primary key is used as a foreign key to 'left join' with view model. */
  @Field({ type: 'StringField' })
  relatedView: string; // eg. OrderItem

  /** Many to many mapping view */
  @Field({ type: 'StringField' })
  mappingView?: string;

  /** MappingView's field to this view's key field */
  @Field({ type: 'StringField' })
  mappingField?: string;

  /** MappingView's field to related view's key field */
  @Field({ type: 'StringField' })
  relatedField?: string;

  /** Whether to allow choosing many items (many to many relation) */
  @Field({ type: 'CheckboxField' })
  multiple?: boolean;

  valueFormatter? = ({ registry: { modelService }, model, value }: PropOptions<LookupFieldModel>): string => {
    const relatedView = modelService.getView<DataViewModel>(model.relatedView);

    if (typeof value === 'object') return value?.[model.labelField] ?? value?.[relatedView.labelField];
    else return value;
  };
}

export const isLookupField = (field: any): field is LookupFieldModel => field.type == 'LookupField';
