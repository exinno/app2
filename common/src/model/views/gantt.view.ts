import { Field, View } from '..';
import { GridBaseViewModel } from '.';

const editModes = ['Auto', 'Dialog'] as const;
export type GanttEditMode = typeof editModes[number];

const timelineModes = ['Hour', 'Day', 'Week', 'Month', 'Year'] as const;
export type TimelineModes = typeof timelineModes[number];

const tierUnits = [...timelineModes, 'Minutes'] as const;
export type TierUnits = typeof tierUnits[number];

const durationUnits = ['Day', 'Hour', 'Minutes'] as const;
export type DurationUnits = typeof durationUnits[number];

/** Gantt view model */
@View({
  name: 'ganttView',
  parent: 'dataViews',
  extraFieldGroup: {
    label: 'Gantt options',
    headerClass: 'bg-blue-grey-2'
  }
})
export class GanttViewModel extends GridBaseViewModel {
  declare type?: 'GanttView';

  name? = 'GanttView';

  @Field({ type: 'CheckboxField' })
  enableToggle?: boolean;

  @Field({ type: 'CheckboxField' })
  enableZoom?: boolean;

  @Field()
  startDateField?: string;

  @Field()
  endDateField?: string;

  @Field()
  durationField?: string;

  @Field({ type: 'SelectField', optionItems: tierUnits })
  durationUnit?: DurationUnits;

  @Field()
  timeZone?: string;

  @Field()
  editMode?: GanttEditMode;

  @Field()
  childrenField?: string;

  @Field({ type: 'CheckboxField' })
  includeWeekend?: boolean;

  @Field({ type: 'CheckboxField' })
  allowTaskbarEditing?: boolean = true;

  @Field({ type: 'CheckboxField' })
  renderBaseline?: boolean = true;

  @Field()
  baselineColor?: string;

  @Field({ type: 'SelectField', optionItems: timelineModes })
  timelineMode?: TimelineModes = 'Week';

  @Field({ type: 'SelectField', optionItems: tierUnits })
  topTierUnit?: TierUnits;

  @Field({ type: 'NumberField' })
  topTierCount?: number;

  @Field({
    type: 'PropField',
    propType: '(item: Date) => string'
  })
  topTierFormat?: string | ((item: Date) => string);

  @Field({ type: 'SelectField', optionItems: tierUnits })
  bottomTierUnit?: TierUnits;

  @Field({ type: 'NumberField' })
  bottomTierCount?: number;

  @Field({
    type: 'PropField',
    propType: '(item: Date) => string'
  })
  bottomTierFormat?: string | ((item: Date) => string);

  @Field()
  dateFormat?: string;

  projectStartDate?: Date | string;

  projectEndDate?: Date | string;
}
