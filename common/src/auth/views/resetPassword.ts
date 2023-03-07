import { FormViewModel } from 'index';

export const resetPassword: FormViewModel = {
  type: 'FormView',
  layout: 'FullLayout',
  width: 600,
  viewActionsOn: ['bottom'],
  viewActions: ['resetPassword'],
  webActions: [
    {
      name: 'resetPassword',
      label: 'Reset',
      icon: 'mdi-arrow-up-bold-hexagon-outline',
      actionType: 'overall',
      async execute({ registry: { authService, uiService }, data, viewService }) {
        if (!(await viewService.validate())) return;

        await authService.resetPassword(data.newPassword);
        uiService.notify({ message: `Password has been reset` });
      }
    }
  ],

  fields: [
    {
      type: 'StringField',
      inputType: 'password',
      name: 'newPassword',
      autocomplete: 'new-password',
      cols: 9,
      validators: ['password']
    },
    {
      type: 'StringField',
      inputType: 'password',
      name: 'confirmPassword',
      autocomplete: 'new-password',
      cols: 9,
      validate: ({ value, data, registry: { authService } }) => {
        return !authService.user
          ? data.newPassword == value || 'Password does not match'
          : data.confirmPassword == value || 'Password does not match';
      }
    }
  ]
};
