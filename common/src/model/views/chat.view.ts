import { PropOptions, ViewModel } from '../';
import { GroupMember } from '../../auth';
import { FindResult } from '../../data';
import { View } from '../model.decorator';

export class ChatbotViewModel extends ViewModel {
  declare type?: 'ChatbotView';

  name? = 'ChatbotView';
}

/** Chat view */
@View({
  name: 'chatView'
})
export class ChatViewModel extends ViewModel {
  declare type?: 'ChatView';

  name? = 'ChatView';

  getMessages: (options: PropOptions<ChatViewModel>) => Promise<FindResult<ChatMessage>>;

  getGroupMembers: (options: PropOptions<ChatViewModel>) => Promise<FindResult<GroupMember>>;

  send: (options: PropOptions<ChatViewModel>) => Promise<void>;

  inputActions: string[];
}

export interface ChatMessage {
  id: string;
  from: string;
  to: string | string[];
  message: any;
  dataView: string;
  dataIds: string[];
  data: any[];
  sentDate: Date;
}

export interface ChatMember {
  id?: string;

  name?: string;

  displayName?: string;

  picture?: string;

  call?: any;

  userMedia?: MediaStream;

  streamActive?: boolean;

  muted?: any;

  intervalId?: any;
}
