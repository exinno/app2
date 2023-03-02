import { CustomViewModel } from 'app2-common';

export const home: CustomViewModel = {
  type: 'CustomView',
  component: 'home',
  ignoreProps: true,
  viewActionsOn: ['toolbar'],
  viewActions: ['googleSignIn', 'openSignIn', 'openSignUp']
};
