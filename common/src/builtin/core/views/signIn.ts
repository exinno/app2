import { FormViewModel } from '../../../';

export const signIn: FormViewModel = {
  type: 'FormView',
  width: '400px',
  viewClass: 'q-pt-md',
  viewActionsOn: ['bottom'],
  viewActions: ['signIn', '-', 'googleSignIn', 'openSignUp', 'openForgotPassword'],
  viewActionsClass: 'column',
  keyField: 'ID',
  fields: [
    {
      type: 'StringField',
      name: 'username',
      label: ({
        registry: {
          config: { signInMethod }
        }
      }) => signInMethod.toUpperCase()[0] + signInMethod.slice(1),
      required: true,
      cols: 12
    },
    {
      type: 'StringField',
      name: 'password',
      label: 'Password',
      inputType: 'password',
      required: true,
      cols: 12,
      onEnter({ registry: { modelService }, viewModel, data }) {
        void modelService.executeWebAction('signIn', { viewModel, data });
      }
    }
  ],
  webActions: [
    {
      name: 'signIn',
      label: 'Sign-in',
      icon: 'mdi-door',
      actionType: 'overall',
      execute: async ({ registry: { authService }, data }) => {
        const { username, password } = data;

        if (!username || !password) return;
        await authService.signIn(username, password);
      }
    }
  ]
};
