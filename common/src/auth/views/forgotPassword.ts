import { FormViewModel } from 'index';

export const forgotPassword: FormViewModel = {
  type: 'FormView',
  serverView: 'users',
  viewActionsOn: ['bottom'],
  viewActions: ['sendResetPasswordLink'],
  viewActionsClass: 'column',
  width: '400px',
  acl: 'public',
  webActions: [
    {
      name: 'sendResetPasswordLink',
      icon: 'mdi-email-outline',
      actionType: 'overall',
      async execute({ registry: { authService, uiService }, data, viewService }) {
        if (!(await viewService.validate())) return;

        await authService.sendResetPasswordLink(data.email);
        uiService.notify({ message: `Link for reset password has been sent to ${data.email}.` });
        await uiService.close(uiService.lastOpened);
      }
    }
  ],
  fields: [
    {
      type: 'StringField',
      name: 'email',
      inputType: 'email',
      validators: ['email'],
      required: true,
      cols: 12,
      validate: async ({ value, registry: { authService } }) => {
        return (await authService.isExistingUser(value, 'email')) || `Email you have entered is not registered. `;
      }
    }
  ]
};
