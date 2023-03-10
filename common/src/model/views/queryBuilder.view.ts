import { ViewModel, ViewService } from '..';
import { View } from '../models/model.decorator';

/** Query builder view model */
@View({
  name: 'queryBuilderView',
  parent: 'views'
})
export class QueryBuilderViewModel extends ViewModel<ViewService> {
  declare type?: 'QueryBuilderView';

  name? = 'QueryBuilderView';
}
