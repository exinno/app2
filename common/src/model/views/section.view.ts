import { ContainerViewModel } from './container.view';
import { View } from '../model.decorator';

/** Section view model */
@View({
  name: 'sectionView',
  parent: 'views'
})
export class SectionViewModel extends ContainerViewModel {
  declare type?: 'SectionView';

  name? = 'SectionView';
}
