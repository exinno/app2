import { DataGridViewModel, Field, FieldModel, RelationField, View } from '..';

/** Data grid field */
@View({
  name: 'dataGridField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'relatedView', 'relatedField', 'verticalAction', 'dataGridModel']
})
export class DataGridFieldModel extends FieldModel implements RelationField {
  declare type: 'DataGridField';

  name? = 'DataGridField';

  icon? = 'mdi-table';

  dataType? = 'array' as const;

  cols? = 12;

  /** Used in one to many relations, 'relatedView' must be defined in lookup field.
   *  Related view's primary key is used as a foreign key to 'left join' with view model. */
  @Field({ type: 'StringField' })
  relatedView?: string;

  /** Related field used as a foreign key of other view model.
   * TODO check*/
  @Field({ type: 'StringField' })
  relatedField?: string;

  dataGridModel?: DataGridViewModel;

  /** Whether to show action buttons in side of detail view*/
  @Field({ type: 'CheckboxField' })
  verticalAction?: boolean = false;
}
