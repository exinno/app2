import { ViewModel } from '../';
import { View } from '../models/model.decorator';

/** Custom view */
@View({
  name: 'customView',
  parent: 'views'
})
export class CustomViewModel extends ViewModel {
  declare type?: 'CustomView';

  name? = 'CustomView';
}

export function isCustomView(viewModel: any): viewModel is CustomViewModel {
  return viewModel?.type == 'CustomView';
}
