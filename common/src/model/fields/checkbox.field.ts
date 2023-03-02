import { FieldModel, PropOptions, View } from '..';
import { Field } from '../model.decorator';

/** Checkbox field */
@View({
  name: 'checkboxField',
  parent: 'fields',
  simpleFormFields: [
    'type',
    'name',
    'label',
    'defaultValue',
    'indeterminate',
    'trueValue',
    'falseValue',
    'trueLabel',
    'falseLabel'
  ]
})
export class CheckboxFieldModel extends FieldModel {
  declare type?: 'CheckboxField';

  name? = 'CheckboxField';

  icon? = 'mdi-checkbox-marked';

  dataType? = 'boolean' as const;

  columnType? = 'boolean' as const;

  /** When user clicks/taps on the component, should we toggle through the indeterminate state too?  */
  @Field({ type: 'CheckboxField' })
  indeterminate?: boolean;

  @Field({ type: 'PropField', propType: 'any' })
  trueValue?: any = true;

  @Field({ type: 'PropField', propType: 'any' })
  falseValue?: any = false;

  cellStyle? = { 'text-align': 'center' };

  /** Label to use when value is true. */
  @Field({ type: 'StringField' })
  trueLabel?: string = 'O';

  /** Label to use when value is false. */
  @Field({ type: 'StringField' })
  falseLabel?: string = 'X';

  /** The icon to be used when the model is truthy (instead of the default design). */
  @Field({ type: 'StringField' })
  checkedIcon?: string;

  /** The icon to be used when the model is falsy (instead of the default design).*/
  @Field({ type: 'StringField' })
  uncheckedIcon?: string;

  valueFormatter? = <T extends this>(options: PropOptions<T>): string => {
    const { model, value } = options;
    if (value === model.trueValue) return model.trueLabel;
    else if (value === model.falseValue) return model.falseLabel;
    else return value;
  };

  valueParser? = <T extends this>(options: PropOptions<T>): boolean => {
    if (options.value === options.model.trueLabel) return options.model.trueValue;
    else return false;
  };
}
