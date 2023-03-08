import { ChoiceModel } from '..';

const list: Array<ChoiceModel> = [
  {
    name: 'principalType',
    choiceItems: [
      { label: 'User', value: 'user', icon: 'mdi-account' },
      { label: 'Group', value: 'group', icon: 'mdi-account-multiple' }
    ]
  },
  {
    name: 'memberRole',
    choiceItems: [
      { label: 'Manager', value: 'manager', icon: 'mdi-crown' },
      { label: 'Member', value: 'member', icon: 'mdi-account' }
    ]
  },
  {
    name: 'permission',
    label: 'Permission',
    choiceItems: [
      { label: 'Any', value: 'any', icon: 'mdi-asterisk' },
      { label: 'No', value: 'no', icon: 'mdi-cancel' },
      { label: 'List', value: 'list', icon: 'mdi-pencil' },
      { label: 'View', value: 'view', icon: 'mdi-eye' },
      { label: 'Add', value: 'add', icon: 'mdi-plus' },
      { label: 'Edit', value: 'edit', icon: 'mdi-pencil' }
    ]
  },
  {
    name: 'userStatus',
    label: 'User Status',
    choiceItems: [
      { label: 'Online', value: 'online', icon: 'mdi-account-badge' },
      { label: 'Offline', value: 'offline', icon: 'mdi-account-cancel' }
    ]
  },
  {
    name: 'contentType',
    choiceItems: [
      { label: 'Text', value: 'text', icon: 'mdi-text' },
      { label: 'HTML', value: 'html', icon: 'mdi-language-html5' }
    ]
  },
  {
    name: 'messagingChannel',
    choiceItems: [
      { label: 'SMS', value: 'sms', icon: 'mdi-cellphone' },
      { label: 'E-mail', value: 'email', icon: 'mdi-email' },
      { label: 'KakaoTalk', value: 'kakaoTalk', icon: 'mdi-chat' },
      { label: 'App Push', value: 'push', icon: 'mdi-square-rounded-badge' }
    ]
  },
  {
    name: 'campaignType',
    choiceItems: [
      { label: 'Manual', value: 'manual' },
      { label: 'Event', value: 'event' },
      { label: 'Periodical', value: 'periodical' }
    ]
  },
  {
    name: 'campaignStatus',
    choiceItems: [
      { label: 'Draft', value: 'draft' },
      { label: 'Prepared', value: 'prepared' },
      { label: 'Sent', value: 'sent' }
    ]
  },
  {
    name: 'deliveryStatus',
    choiceItems: [
      { label: 'Prepared', value: 'prepared' },
      { label: 'Reserved', value: 'reserved' },
      { label: 'Sent', value: 'sent' },
      { label: 'Received', value: 'received' },
      { label: 'No recipient', value: 'noRecipient' }
    ]
  },
  {
    name: 'currency',
    label: 'Currency',
    choiceItems: [
      { label: 'US Dollar', value: 'USD', icon: 'mdi-currency-usd', color: '#9c27b0ff' },
      { label: 'KR Won', value: 'KRW', icon: 'mdi-currency-krw' },
      { label: 'EU Euro', value: 'EUR', icon: 'mdi-currency-eur' },
      { label: 'GB Pound', value: 'GBP', icon: 'mdi-currency-gbp' },
      { label: 'JP Yen', value: 'JPY', icon: 'mdi-currency-jpy' },
      { label: 'CN Yuan', value: 'CNY', icon: 'mdi-currency-cny' },
      { label: 'RU Ruble', value: 'RUB', icon: 'mdi-currency-rub' },
      { label: 'IN Rupee', value: 'INR', icon: 'mdi-currency-inr' }
    ]
  },
  {
    name: 'language',
    label: 'Language',
    choiceItems: [
      { value: 'en', label: 'English' },
      { value: 'ko', label: 'Korean' },
      { value: 'zh', label: 'Chinese' },
      { value: 'ja', label: 'Japanese' },
      { value: 'fr', label: 'French' },
      { value: 'de', label: 'German' },
      { value: 'es', label: 'Spanish' },
      { value: 'it', label: 'Italian' },
      { value: 'pt', label: 'Portuguese' },
      { value: 'ru', label: 'Russian' }
    ]
  }
];

export default list;
