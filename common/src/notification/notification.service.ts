import dayjs from 'dayjs';
import { httpClient, jsSerializer, randomString, registry } from '..';

export type NotifyType = 'notification' | 'notify' | 'memberChanged' | 'dataChanged' | string;

export interface NotifyItem {
  type: NotifyType;
  from?: string;
  to?: string | string[];
  instanceId?: string;
  subscribeId?: string;
  message: any;
  sentDate: Date;
}

export interface NotifyListener {
  type: NotifyType;
  subscribeId?: string;
  execute: (notifyItem: NotifyItem) => void;
}

export class NotificationService {
  private eventSource?: EventSource;

  private permission: NotificationPermission;

  private listeners: NotifyListener[] = [];

  instanceId = randomString();

  async init() {
    console.debug('NotificationService init ', this.instanceId);
    this.eventSource?.close();
    if (typeof Notification != 'undefined')
      void Notification.requestPermission((permission) => (this.permission = permission));

    this.eventSource = new EventSource('/api/notification/' + this.instanceId);
    this.eventSource.onmessage = ({ data }) => {
      const notifyItem: NotifyItem = jsSerializer.deserialize(data);
      console.debug('notified', notifyItem);
      const caption = `${notifyItem.from} sent ${dayjs(notifyItem.sentDate).format('lll')}`;
      if (notifyItem.type == 'notification' && this.permission == 'granted') {
        new Notification(`${notifyItem.message}`, { body: caption });
      } else if (notifyItem.type == 'notify' || notifyItem.type == 'notification') {
        registry.uiService.notify({
          position: 'top',
          timeout: 1000 * 60 * 60,
          message: notifyItem.message,
          icon: 'mdi-chat',
          caption,
          color: 'primary',
          multiLine: true,
          actions: [
            {
              label: 'Dismiss',
              color: 'white',
              handler: () => {
                //
              }
            }
          ]
        });
      }

      const listeners = this.listeners.filter(
        (listener) =>
          listener.type == notifyItem.type && (!listener.subscribeId || listener.subscribeId == notifyItem.subscribeId)
      );
      for (const listener of listeners) listener.execute(notifyItem);
    };
  }

  notify(item: Partial<NotifyItem>) {
    return httpClient.request({ serviceName: 'notification', method: 'POST', data: item });
  }

  addListener(listener: NotifyListener) {
    this.listeners.push(listener);
  }

  close() {
    this.eventSource?.close();
    void httpClient.request({ serviceName: 'notification/' + this.instanceId, method: 'delete' });
  }
}
