import { FormViewModel } from 'index';

export const reSendVerificationCode: FormViewModel = {
  type: 'FormView',
  serverView: 'users',
  label: 'Send Verification Code',
  viewActionsOn: ['bottom'],
  viewActions: ['sendEmailVerificationCode'],
  viewActionsClass: 'column',
  width: '600px',
  acl: 'public',
  webActions: [
    {
      name: 'sendEmailVerificationCode',
      icon: 'mdi-email-outline',
      actionType: 'overall',
      async execute({ registry: { authService, uiService }, data, viewService }) {
        if (!(await viewService.validate())) return;

        await authService.sendVerificationLink(data.email, true);
        uiService.close(uiService.lastOpened);
        return `Link for verification has been sent to ${data.email}.`;
      }
    }
  ],
  fields: [
    {
      type: 'StringField',
      name: 'email',
      inputType: 'email',
      validators: ['email'],
      editable: false,
      required: true,
      cols: 12,
      defaultValue: ({ pageCtx }) => pageCtx.username
    }
  ]
};
