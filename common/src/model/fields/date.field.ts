import { Field, FieldModel, PropOptions, View } from '..';

const dateTypes = <const>['date', 'dateTime', 'month', 'year'];

/** Date field */
@View({
  name: 'dateField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'dateType', 'timeZone', 'fromNow', 'defaultValue']
})
export class DateFieldModel extends FieldModel {
  declare type: 'DateField';

  name? = 'DateField';

  icon? = 'mdi-calendar';

  dataType? = 'date' as const;

  columnType? = 'datetime' as const;

  /** It defines specific data type of the date field. Such as 'dateTime', 'month', 'year' and etc.  */
  @Field({
    type: 'SelectField',
    optionItems: dateTypes,
    multiple: false
  })
  dateType?: typeof dateTypes[number] = 'dateTime';

  /** It defines specific time zone of the date field. Such as 'Asia/Seoul, 'America/New_york' and etc. */
  @Field({ type: 'StringField' })
  timeZone?: string;

  /** Whether to include milliseconds in time. */
  @Field({ type: 'CheckboxField' })
  showMilliseconds?: boolean;

  @Field({ type: 'CheckboxField' })
  fromNow?: boolean;

  valueFormatter? = ({ model, value = null, registry: { dayjs } }: PropOptions<DateFieldModel>) => {
    if (model.fromNow) {
      return value ? dayjs(value).fromNow() : value;
    } else {
      const longDateFormat = dayjs.localeData().longDateFormat('L');
      const timeFormat = model.showMilliseconds ? 'HH:mm:ss.SSS' : 'HH:mm:ss';
      const dateformat = {
        date: longDateFormat,
        dateTime: `${longDateFormat} ${timeFormat}`,
        month: 'YYYY-MM',
        year: 'YYYY'
      }[model.dateType];

      return value ? dayjs(value).tz(model.timeZone).format(dateformat) : value;
    }
  };

  valueParser? = ({ model, value, registry: { dayjs } }: PropOptions<this>) => {
    return dayjs(value).tz(model.timeZone).toDate();
  };
}

export const isDateField = (field: any): field is DateFieldModel => field.type == 'DateField';
