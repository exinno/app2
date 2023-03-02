import { Model } from '.';
import { Field, View } from './model.decorator';

/**
 * Choice model
 */
@View({
  name: 'choices',
  table: 'choices',
  parent: 'models',
  formFields: ['name', 'icon', 'label', 'category', 'choiceItems'],
  columnFields: ['name', 'icon', 'label', 'category']
})
export class ChoiceModel extends Model {
  /** List of choice items. Items can be added in 'Choice' screen by clicking on edit button.
   *  New choice can be created with add button.
   *  Field with type of 'ChoiceField' can set predefined choice. */
  @Field({
    type: 'DataGridField',
    cols: 12,
    dataGridModel: {
      parent: 'choiceItems'
    }
  })
  choiceItems: ChoiceItemModel[];
}

@View({
  name: 'choiceItems',
  keyField: 'code'
})
export class ChoiceItemModel {
  /** Label of choice item. */
  @Field() label: string;

  /** Value of choice item.
   *  TODO  always label? */
  @Field() value: string;

  /** Icon of choice item. */
  @Field({ type: 'IconField' }) icon?: string;

  /** Color of choice item. */
  @Field({ type: 'ColorField' }) color?: string;

  /** value of choice item. */
  @Field() value1?: string;

  /** value of choice item. */
  @Field() value2?: string;

  /** value of choice item. */
  @Field() value3?: string;

  /** Description of the choice item. */
  @Field() description?: string;
}
