import { FieldModel, RelationField, ListSectionModel, PropOptions, View, Field } from '..';

/** List field */
@View({
  name: 'listField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'relatedView', 'relatedField', 'listSections']
})
export class ListFieldModel extends FieldModel implements RelationField {
  declare type: 'ListField';

  name? = 'ListField';

  icon? = 'mdi-view-list';

  @Field()
  relatedView?: string;

  @Field()
  relatedField?: string;

  @Field()
  listSections?:
    | ListSectionModel[]
    | ListSectionModel[][]
    | (<T extends this>(options: PropOptions<T>) => ListSectionModel[] | ListSectionModel[][]);

  @Field()
  bordered: boolean;

  @Field()
  padding?: boolean;

  @Field()
  dense?: boolean;
}
