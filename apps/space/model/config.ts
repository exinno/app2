import { ConfigModel } from 'app2-common';

const config: ConfigModel = {
  title: 'Space',
  icon: 'mdi-folder-file',
  version: '1.0',
  containerDomain: 'app2.dev',
  port: 3000,
  defaultAcl: 'authRead',
  redisUrl: process.env.APP2_REDIS,
  redisPassword: 'Wkwkd369',
  locales: ['ko', 'en', 'zh', 'ja'],
  plugins: ['ej2', 'monaco-editor', 'tiptap'],
  apps: ['crm'],
  updateSchemaOnBootstrap: true,
  messagingChannel: 'email',
  approvalRequired: false,
  emailVerificationRequired: false,
  smsVerificationRequired: false,
  signInMethod: 'username',
  attachmentPath: './files',
  onUserLoaded: async ({ registry: { modelService } }) => {
    await modelService.executeWebAction('mySpaces.loadMySpacesMenu');
  },
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
