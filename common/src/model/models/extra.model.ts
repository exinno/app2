import { Model, PropOptions } from '..';
import { Field, View } from './model.decorator';

/**
 * Chat intent model
 */
@View({
  name: 'chatIntents',
  table: 'chatIntents',
  parent: 'models'
})
export class ChatIntentModel extends Model {
  patterns: RegExp[];
  successResponse?: string;
  failResponse?: string;
  disabled?: boolean;

  /** Expected action callback to be called. */
  @Field({
    type: 'PropField',
    propType: '<T extends this>(options: PropOptions<T>) => any'
  })
  execute?: <T extends this>(options: PropOptions<T>) => any;
}
