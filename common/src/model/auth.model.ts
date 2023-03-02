/** Auth model */
export interface AuthModel {
  view: string;
  keyField: string;
  usernameField: string;
  passwordField: string;
  displayField: string;
  emailField: string;
  phoneNumberField?: string;
  lockField?: string;
  loginTriedField?: string;
  tokenField?: string;
  tokenCreatedField?: string;
  verifiedField?: string;
  maxLoginAttempts?: number;
  passwordMinLen?: number;
  passwordMaxLen?: number;
  passwordMaxAge?: number;
  cityField?: string;
  countryField?: string;
  ipField?: string;
}
