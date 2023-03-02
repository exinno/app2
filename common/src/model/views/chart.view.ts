import { View } from '..';
import { DataViewModel } from './data.view';

/** Chart view */
@View({
  name: 'chartView',
  parent: 'views',
  extraFieldGroup: {
    label: 'Chart Options',
    headerClass: 'bg-blue-grey-2'
  }
})
export class ChartViewModel extends DataViewModel {
  declare type?: 'ChartView';

  name? = 'ChartView';
}
