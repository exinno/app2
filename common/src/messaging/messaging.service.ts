import { Dict } from '../data';
import { ModelService } from '../model';

export interface SendOptions {
  campaign?: string;
  from?: string;
  to?: string;
  subject?: string;
  template?: string;
  params?: Dict;
  channel?: MessagingChannel;
  content?: string;
  contentType?: 'html' | 'text';
  usingCampaign?: boolean;
  recipient?: {
    to: string;
    content?: string;
    params?: Dict;
  };
}

export const messagingChannel = ['email', 'sms', 'kakao'] as const;
export type MessagingChannel = typeof messagingChannel[number];

export abstract class MessagingService {
  constructor(protected modelService: ModelService) {}

  abstract send(options: SendOptions): Promise<any>;

  abstract sendCampaign(campaign: Dict): Promise<void>;

  abstract refreshStatus(): Promise<void>;
}

export interface TransportService {
  send(options: SendOptions): Promise<Dict>;

  refreshStatus(): Promise<void>;
}
