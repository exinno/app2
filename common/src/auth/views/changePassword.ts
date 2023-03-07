import { FormViewModel } from 'index';

export const changePassword: FormViewModel = {
  type: 'FormView',
  width: 600,
  viewActionsOn: ['toolbar'],
  viewActions: ['updatePassword'],
  webActions: [
    {
      name: 'updatePassword',
      label: 'Update',
      icon: 'mdi-arrow-up-bold-hexagon-outline',
      actionType: 'overall',
      async execute({ registry: { authService, uiService }, data, viewService }) {
        if (!(await viewService.validate())) return;

        await authService.updatePassword(data.newPassword, data.currentPassword);
        uiService.notify({ message: `Password has been changed` });
        uiService.close(uiService.lastOpened);
      }
    }
  ],

  fields: [
    {
      type: 'StringField',
      inputType: 'password',
      name: 'currentPassword',
      autocomplete: 'current-password',
      cols: 12
    },
    {
      type: 'StringField',
      inputType: 'password',
      name: 'newPassword',
      autocomplete: 'new-password',
      cols: 12,
      validators: ['password']
    },
    {
      type: 'StringField',
      inputType: 'password',
      name: 'confirmPassword',
      autocomplete: 'new-password',
      cols: 12,
      validate: ({ value, data }) => {
        if (!(data.newPassword == value)) return 'Password does not match';
      }
    }
  ]
};
