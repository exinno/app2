import { View } from '../model.decorator';
import { ViewModel, PropOptions } from '..';

/** HTML view model */
@View({
  name: 'htmlView',
  parent: 'views'
})
export class HtmlViewModel extends ViewModel {
  declare type?: 'HtmlView';

  name? = 'HtmlView';

  declare data?: string | (<T extends this>(options: PropOptions<T>) => string);
}
