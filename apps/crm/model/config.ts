import { ConfigModel } from 'app2-common';

const config: ConfigModel = {
  title: 'CRM',
  icon: 'mdi-account-group',
  version: '1.0',
  containerDomain: 'app2.dev',
  port: 3000,
  defaultAcl: 'authRead',
  redisUrl: process.env.APP2_REDIS,
  redisPassword: 'Wkwkd369',
  locales: ['en', 'zh', 'ja'],
  plugins: ['ej2', 'monaco-editor', 'tiptap'],
  updateSchemaOnBootstrap: true,
  messagingChannel: 'email',
  emailVerificationRequired: false,
  smsVerificationRequired: false,
  signInMethod: 'username',
  attachmentPath: './files',
  emailTransport: {
    service: 'gmail',
    auth: {
      user: '',
      pass: '',
      emailFrom: ''
    }
  },
  smsTransport: {
    service: 'aligo',
    auth: {
      key: '',
      user_id: '',
      smsFrom: ''
    }
  }
};

export default config;
