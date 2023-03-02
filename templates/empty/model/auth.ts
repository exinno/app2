import { AuthModel } from 'app2-common';

const authModel: AuthModel = {
  view: 'users',
  keyField: 'id',
  displayField: 'displayName',
  passwordField: 'password',
  usernameField: 'name',
  emailField: 'email',
  lockField: 'accountLocked',
  loginTriedField: 'loginTried',
  maxLoginAttempts: 5,
  passwordMinLen: 4,
  passwordMaxLen: 20
};

export default authModel;
