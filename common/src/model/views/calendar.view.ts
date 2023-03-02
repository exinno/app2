import { Field, View } from '..';
import { DataViewModel } from './data.view';

export const calenderTypes = <const>[
  'Day',
  'Week',
  'WorkWeek',
  'Month',
  'Agenda',
  'MonthAgenda',
  'TimelineDay',
  'TimelineWeek',
  'TimelineWorkWeek',
  'TimelineMonth',
  'TimelineYear'
];

/** Calendar view */
@View({
  name: 'calendarView',
  parent: 'dataViews',
  extraFieldGroup: {
    label: 'Calendar options',
    headerClass: 'bg-blue-grey-2'
  }
})
export class CalendarViewModel extends DataViewModel {
  declare type?: 'CalendarView';

  name? = 'CalendarView';

  @Field()
  startDateField?: string;

  @Field()
  endDateField?: string;

  @Field()
  contentField?: string;

  @Field()
  colorField?: string;

  @Field({ type: 'CheckboxField' })
  allowDragAndDrop?: boolean;

  @Field({ type: 'CheckboxField' })
  allowMultiCellSelection?: boolean;

  @Field({ type: 'CheckboxField' })
  allowMultiRowSelection?: boolean;

  @Field({ type: 'CheckboxField' })
  allowAdding?: boolean;

  @Field({ type: 'CheckboxField' })
  allowEditing?: boolean;

  @Field({ type: 'CheckboxField' })
  allowDeleting?: boolean;

  @Field({ type: 'CheckboxField' })
  showWeekend?: boolean;

  @Field({ type: 'CheckboxField' })
  showTimeScale?: boolean;

  @Field({ type: 'CheckboxField' })
  showHeaderBar?: boolean;

  @Field({ type: 'CheckboxField' })
  showQuickInfo?: boolean;

  // 0: sunday, 1: monday ...
  @Field({ type: 'NumberField' })
  firstDayOfWeek?: number;

  @Field({
    type: 'SelectField',
    optionItems: calenderTypes,
    multiple: true
  })
  calenderTypes?: typeof calenderTypes[number][] = ['Day', 'Week', 'Month', 'Agenda'];

  @Field({
    type: 'SelectField',
    optionItems: calenderTypes,
    multiple: false
  })
  defaultCalenderType?: typeof calenderTypes[number] = 'Month';

  @Field()
  timeZone?: string;
}
