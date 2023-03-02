import { Field, FieldModel, PropOptions, ValidatorModel, View } from '..';

/** Percent field */
@View({
  name: 'percentField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'scale']
})
export class PercentFieldModel extends FieldModel {
  declare type: 'PercentField';

  name? = 'PercentField';

  icon? = 'mdi-percent';

  dataType? = 'number' as const;

  columnType? = 'float' as const;

  cellStyle? = { 'text-align': 'right' };

  /** Used in value formatter as minimum/maximum fraction digits.
   * Default to 0. */
  @Field({ type: 'NumberField' })
  scale?: number;

  valueFormatter? = <T extends this>(options: PropOptions<T>): string => {
    const value = options.value;
    const scale = options.model.scale ?? 0;
    const percentFormat = new Intl.NumberFormat(navigator.language, {
      style: 'percent',
      minimumFractionDigits: scale,
      maximumFractionDigits: scale
    });

    return value ? percentFormat.format(value) : null;
  };

  valueParser? = <T extends this>(options: PropOptions<T>) => {
    const parsedValue = parseFloat(options.value.trim().replace(/[%,]/g, ''));

    return isNaN(parsedValue) ? options.value : parsedValue;
  };

  validate? = ({ value }: PropOptions<ValidatorModel>) => {
    return !value || typeof value === 'number' || 'Please enter a percent';
  };
}
