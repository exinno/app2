import { View } from '../model.decorator';
import { Field } from '..';
import { DataViewModel } from '.';

const timelineLayoutUnits = ['dense', 'comfortable', 'loose'] as const;

/** Timeline view model */
@View({
  name: 'timelineView',
  parent: 'views'
})
export class TimelineViewModel extends DataViewModel {
  declare type: 'TimelineView';

  name? = 'TimelineView';

  color?: string;

  dark?: boolean;

  side?: 'left' | 'right';

  @Field({ type: 'SelectField', optionItems: timelineLayoutUnits })
  timelineLayout?: typeof timelineLayoutUnits[number];

  headline?: string;

  titleField?: string;

  subtitleField?: string;

  bodyField?: string;

  pageSize?: number;
}
