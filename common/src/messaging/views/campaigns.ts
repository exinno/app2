import { DataGridViewModel, TabViewModel } from '../..';

export const campaigns: DataGridViewModel = {
  type: 'DataGridView',
  parent: 'editable',
  table: 'OcCampaign',
  label: 'Campaigns',
  labelField: 'subject',
  detailView: {
    parent: 'campaignDetail',
    openType: 'route'
  },
  fields: [
    { name: 'subject', type: 'StringField', cols: 12, required: true },
    { name: 'campaignType', type: 'ChoiceField', choice: 'campaignType', defaultValue: 'manual', required: true },
    { name: 'campaignStatus', type: 'ChoiceField', choice: 'campaignStatus', defaultValue: 'draft', required: true },
    {
      name: 'channel',
      type: 'ChoiceField',
      choice: 'messagingChannel',
      defaultValue: ({ registry: { config } }) => config?.messagingChannel,
      onChange: ({ registry: { config }, data, value }) => {
        return (data.from = config[value + 'From']);
      },
      required: true
    },
    { name: 'reserveDate', type: 'DateField' },
    {
      name: 'from',
      type: 'StringField',
      defaultValue: ({ registry: { config } }) => {
        const channel = config.messagingChannel;
        return config[channel + 'Transport'].auth[channel + 'From'];
      }
    },
    {
      name: 'toField',
      type: 'SelectField',
      defaultValue: 'to',
      cols: 3,
      optionItems: ({ data }) => (data.recipients ? Object.keys(data?.recipients[0]) : null),
      hint: ({ data }) =>
        `Select ${data.channel == 'email' ? 'E-mail' : 'Phone Number'} column to receive from recipients sheet`
    },
    {
      name: 'contentField',
      type: 'SelectField',
      cols: 3,
      defaultValue: 'content',
      optionItems: ({ data }) => (data.recipients ? Object.keys(data?.recipients[0]) : null),
      hint: 'Choose a field, which will be used as a message content. Campaign content will be sent if content is not defined in sheet. '
    },
    {
      name: 'recipientSheet',
      type: 'SheetField',
      tableDataField: 'recipients',
      cols: 12
    },
    {
      name: 'recipients',
      type: 'JsonField',
      defaultValue: [{ to: '', name: '', content: '' }],
      hidden: true
    },
    { name: 'content', label: 'Campaign content', type: 'StringField', inputType: 'textarea', cols: 12 },
    { name: 'contentType', type: 'ChoiceField', choice: 'contentType', defaultValue: 'text' },
    {
      name: 'template',
      type: 'LookupField',
      relatedView: 'templates',
      onChange: ({ data, value }) => {
        data.content = value.content;
        data.contentType = value.contentType;
        data.subject = value.subject;
      }
    }
  ],
  serverActions: [
    {
      name: 'sendCampaign',
      icon: 'mdi-send-check',
      execute: async ({ registry: { messagingService }, data }) => {
        //TODO change status upon submit
        await messagingService.sendCampaign(data);
        return 'Message has been sent.';
      }
    }
  ]
};

export const campaignDetail: TabViewModel = {
  type: 'TabView',
  label: 'Campaign',
  children: [
    {
      type: 'FormView',
      parent: 'campaigns',
      label: 'Campaign',
      name: 'campaigns',
      viewActions: ['submitForm', 'sendCampaign']
    },
    'campaignDeliveries'
  ]
};

export const campaignDeliveries: DataGridViewModel = {
  parent: 'deliveries',
  editMode: 'Batch',
  allowAdding: true,
  allowEditing: true,
  allowDeleting: true,
  columnFields: ['to', 'content', 'channel', 'resultCode', 'messageState', 'createdAt'],
  defaultData: ({ dataId }) => ({ campaign: dataId }),
  filter: ({ dataId }) => ({ field: 'campaign', value: dataId }),
  hidden: ({ dataId }) => dataId == '$new'
};
