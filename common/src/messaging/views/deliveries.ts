import { DataGridViewModel } from 'index';

export const deliveries: DataGridViewModel = {
  type: 'DataGridView',
  parent: 'recordable',
  table: 'OcDelivery',
  label: 'Deliveries',
  viewActions: ['refreshStatus'],
  serverActions: [
    {
      name: 'refreshStatus',
      icon: 'mdi-refresh-circle',
      execute: async ({ registry: { messagingService } }) => {
        await messagingService.refreshStatus();
        return 'Message status has been updated.';
      }
    }
  ],
  fields: [
    { name: 'campaign', type: 'LookupField', relatedView: 'campaigns' },
    { name: 'channel', type: 'ChoiceField', choice: 'messagingChannel', hidden: ({ data }) => !!data?.campaign },
    { name: 'to', type: 'StringField' },
    { name: 'from', type: 'StringField', hidden: ({ data }) => !!data?.campaign },
    { name: 'subject', type: 'StringField', cols: 12, hidden: ({ data }) => !!data?.campaign },
    { name: 'content', type: 'StringField', inputType: 'textarea', cols: 12, hidden: ({ data }) => !!data?.campaign },
    { name: 'contentType', type: 'ChoiceField', choice: 'contentType', hidden: ({ data }) => !!data?.campaign },
    { name: 'template', type: 'LookupField', relatedView: 'templates', hidden: ({ data }) => !!data?.campaign },
    { name: 'params', type: 'PropField', propType: 'Dict', cols: 12 },
    { name: 'sentDate', type: 'DateField', creatable: false, updatable: false },
    { name: 'reserveDate', type: 'DateField', hidden: ({ data }) => !!data?.campaign },
    { name: 'deliveryStatus', type: 'ChoiceField', choice: 'deliveryStatus', creatable: false, updatable: false },
    { name: 'resultMessage', type: 'StringField', creatable: false, updatable: false },
    { name: 'resultId', type: 'StringField', creatable: false, updatable: false },
    { name: 'resultType', type: 'StringField', creatable: false, updatable: false },
    { name: 'resultCode', type: 'StringField', creatable: false, updatable: false },
    { name: 'messageState', type: 'StringField', creatable: false, updatable: false }
  ]
};
