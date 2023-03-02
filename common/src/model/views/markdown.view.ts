import { View } from '../model.decorator';
import { ViewModel, PropOptions } from '..';

/** Markdown view model */
@View({
  name: 'markdownView',
  parent: 'views'
})
export class MarkdownViewModel extends ViewModel {
  declare type?: 'MarkdownView';

  name? = 'MarkdownView';

  declare data?: string | (<T extends this>(options: PropOptions<T>) => string);
}
