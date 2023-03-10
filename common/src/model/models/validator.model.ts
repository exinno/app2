import { Model, PropOptions } from '..';
import { Field, View } from './model.decorator';

/**
 * Validator model
 */
@View({
  name: 'validators',
  table: 'validators',
  parent: 'models',
  formFields: ['name', 'icon', 'label', 'category', 'validate'],
  columnFields: ['name', 'icon', 'label', 'category']
})
export class ValidatorModel extends Model {
  /** Validate property helps to validate field's value based on validation logic. */
  @Field({
    type: 'PropField',
    propType: '(options: PropOptions<ValidatorModel>) => boolean | string | Promise<boolean | string>',
    cols: 12,
    height: '400px'
  })
  validate?: (options: PropOptions<ValidatorModel>) => boolean | string | Promise<boolean | string>;
}
