import { Field, View } from '../';
import { ListViewModel } from './list.view';

/** Comment view */
@View({
  name: 'commentView',
  parent: 'dataViews'
})
export class CommentViewModel extends ListViewModel {
  declare type?: 'CommentView';

  name? = 'CommentView';

  @Field()
  dataView?: string;

  @Field()
  inputActions?: string[];
}
