import { AuthModel } from 'app2-common';

const authModel: AuthModel = {
  view: 'users',
  keyField: 'id',
  displayField: 'displayName',
  passwordField: 'password',
  usernameField: 'name',
  emailField: 'email',
  phoneNumberField: 'phoneNumber',
  lockField: 'accountLocked',
  loginTriedField: 'loginTried',
  tokenField: 'token',
  tokenCreatedField: 'tokenCreatedAt',
  verifiedField: 'accountVerified',
  maxLoginAttempts: 5,
  passwordMinLen: 4,
  passwordMaxLen: 20,
  cityField: 'city',
  countryField: 'country',
  ipField: 'ip'
};

export default authModel;
