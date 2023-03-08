import { View, Field } from '../model.decorator';
import { DataViewModel } from './data.view';

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
