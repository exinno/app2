import { Field, FieldModel, PropOptions, ValidatorModel, View } from '..';

/** A field to enter a number value */
@View({
  name: 'numberField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'defaultValue', 'scale']
})
export class NumberFieldModel extends FieldModel {
  declare type: 'NumberField';

  name? = 'NumberField';

  icon? = 'mdi-numeric';

  dataType? = 'number' as const;

  columnType?: 'float' | 'decimal' = 'float';

  cellStyle? = { 'text-align': 'right' };

  /** 'columnPrecision' can be set when creating column in database and type is either 'float', 'double' or 'decimal'.
   *  Precision is the number of digits in a number.
   *  Column type is default to 'float' in currency, number and percent field. */
  @Field({ type: 'NumberField' })
  columnPrecision?: number;

  /** 'columnScale' can be set when creating column in database and type is either 'float', 'double' or 'decimal'.
   *  Scale is the number of digits to the right of the decimal point in a number.
   *  Column type is default to 'float' in currency, number and percent field. */
  @Field({ type: 'NumberField' })
  columnScale?: number;

  /** Used in value formatter as minimum/maximum fraction digits.
   * Default to 0. */
  @Field({ type: 'NumberField' })
  scale?: number;

  valueFormatter? = <T extends this>(options: PropOptions<T>): string => {
    const value = options.value;
    const scale = options.model.scale ?? 0;
    const numberFormat = new Intl.NumberFormat(navigator.language, {
      style: 'decimal',
      minimumFractionDigits: scale,
      maximumFractionDigits: scale
    });

    return value != null ? numberFormat.format(value) : null;
  };

  valueParser? = <T extends this>(options: PropOptions<T>) => {
    const parsedValue = parseFloat(options.value.trim().replace(/,/g, ''));

    return isNaN(parsedValue) ? options.value : parsedValue;
  };

  validate? = ({ value }: PropOptions<ValidatorModel>) => {
    return value == '' || value == null || typeof value === 'number' || 'Please enter a Number';
  };
}

export const isNumberField = (field: any): field is NumberFieldModel => field.type == 'NumberField';
