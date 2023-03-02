import { DataViewModel } from './data.view';
import { Field, View } from '../model.decorator';

/** Tree view model */
@View({
  name: 'treeView',
  parent: 'views'
})
export class TreeViewModel extends DataViewModel {
  declare type?: 'TreeView';

  name? = 'TreeView';
}
