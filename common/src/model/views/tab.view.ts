import { ContainerViewModel } from './container.view';
import { View } from '../models/model.decorator';

/** Tab view model */
@View({
  name: 'tabView',
  parent: 'views'
})
export class TabViewModel extends ContainerViewModel {
  declare type?: 'TabView';

  name? = 'TabView';

  defaultTab?: string | number = 0;

  bottomTabs?: boolean;
}
