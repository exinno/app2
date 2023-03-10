import { Field, View } from '../models/model.decorator';
import { ViewModel, PropOptions } from '..';

/** Log view model */
@View({
  name: 'logView',
  parent: 'views'
})
export class LogViewModel extends ViewModel {
  declare type?: 'LogView';

  name? = 'LogView';

  declare data?: string[] | (<T extends this>(options: PropOptions<T>) => string[]);

  /** Whether to allow scroll to go down automatically when new contents are added and pages are full. */
  @Field({ type: 'CheckboxField' })
  scrollToBottom?: boolean;
}
