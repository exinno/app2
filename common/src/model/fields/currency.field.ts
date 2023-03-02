import { Field, FieldModel, PropOptions, View } from '..';

const currencies = <const>['KRW', 'USD', 'JPY', 'EUR', 'CNY'];
const currencyFormats = <const>['symbol', 'narrowSymbol', 'code', 'name'];

/** Currency field */
@View({
  name: 'currencyField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'currency', 'currencyFormat', 'scale', 'defaultValue']
})
export class CurrencyFieldModel extends FieldModel {
  declare type: 'CurrencyField';

  name? = 'CurrencyField';

  icon? = 'mdi-currency-usd';

  dataType? = 'number' as const;

  columnType? = 'float' as const;

  cellStyle? = { 'text-align': 'right' };

  /** It defines currency used in record.
   *  Currencies 'KRW', 'USD', 'JPY', 'EUR' and 'CNY' can be selected. */
  @Field({
    type: 'SelectField',
    optionItems: currencies,
    multiple: false
  })
  currency: typeof currencies[number];

  /** It defines format ('symbol', 'narrowSymbol', 'code', 'name') of the currency.
   *  Defaults to 'narrowSymbol'. */
  @Field({
    type: 'SelectField',
    optionItems: currencyFormats,
    multiple: false
  })
  currencyFormat?: typeof currencyFormats[number];

  /** Used in value formatter as minimum/maximum fraction digits.
   *  Defaults to 0. */
  @Field({ type: 'NumberField' })
  scale?: number;

  valueFormatter? = <T extends this>(options: PropOptions<T>): string => {
    const { model, value } = options;
    const scale = options.model.scale ?? 0;
    const currencyFormat = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: model.currency,
      currencyDisplay: model.currencyFormat ?? 'narrowSymbol',
      minimumFractionDigits: scale,
      maximumFractionDigits: scale
    });

    return value ? currencyFormat.format(value) : null;
  };

  valueParser? = <T extends this>(options: PropOptions<T>) => {
    return options.value;
  };
}
