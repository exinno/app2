import { LanguageCode, languageCodes, PropOptions, voidPropField, MessagingChannel } from '..';
import { Field, View } from './model.decorator';

export const plugins = ['ej2', 'monaco-editor', 'tiptap', 'ag-grid', 'uppy'];

export const signInMethod = ['email', 'username'] as const;
export type SignInMethod = typeof signInMethod[number];

/**
 * https://nodemailer.com/smtp/
 */
export interface SMTPTransport {
  service: string;
  host?: string;
  port?: number;
  secure?: boolean;
  pool?: boolean;
  auth: {
    user: string;
    pass: string;
    emailFrom: string;
  };
}

export interface SMSTransport {
  service: string;
  auth: {
    smsFrom: string;
    key: string;
    user_id: string;
  };
}

/** Config model */
@View({
  name: 'config',
  table: 'config',
  dataId: '-',
  datasource: 'model',
  type: 'FormView',
  defaultCols: 4
})
export class ConfigModel {
  @Field()
  approvalRequired?: boolean = false;

  /** Title of the app. */
  @Field()
  title: string;

  /** Version of the app. */
  @Field()
  version: string;

  /** Icon of the app. */
  @Field({ type: 'IconField' })
  icon?: string;

  /** Domain of the container */
  @Field()
  containerDomain?: string;

  /** Port of the app. If not defined, it uses highest number of existing port(+1) as app port.
   *  And if no ports exist, then port defaults to 3001. */
  @Field()
  port: number;

  /** Plugins used for the app. */
  @Field({ type: 'SelectField', multiple: true, optionItems: plugins })
  plugins?: string[];

  /** Other apps used for this app. */
  // TODO: LookupField apps로 잡고 multiple 지원하게
  @Field()
  apps?: string[];

  /** Default acl for the app. */
  @Field()
  defaultAcl: string;

  /** Url of the redis in the app. */
  @Field()
  redisUrl: string;

  /** Password of the redis in the app. */
  @Field()
  redisPassword?: string;

  /** */
  @Field({ type: 'SelectField', multiple: true, optionItems: languageCodes })
  locales: LanguageCode[];

  /** */
  @Field({ type: 'SelectField', optionItems: languageCodes })
  fixedLocale?: string; // dayjs/locale.json

  /** */
  @Field()
  fixedTimeZone?: string;

  /** */
  @Field()
  attachmentPath?: string;

  /** Whether to update schema upon booting(?). */
  @Field()
  updateSchemaOnBootstrap?: boolean;

  /** Description of the config. */
  @Field({ type: 'RichTextField', cols: 12 })
  description?: string;

  /** Client ID used for Google OAuth. */
  @Field()
  googleOAuthClientID?: string;

  /** Client secret used for Google OAuth. */
  @Field()
  googleOAuthClientSecret?: string;

  /** https://nodemailer.com/message/
   *  Using nodeMailer message configuration. */
  @Field({ type: 'PropField', propType: 'SMTPTransport' })
  emailTransport?: SMTPTransport;

  /** https://smartsms.aligo.in/admin/api/spec.html/
   *  Using aligo message configuration. */
  @Field()
  smsTransport?: SMSTransport;

  /** Whether email verification to the account is needed. */
  @Field()
  emailVerificationRequired?: boolean;

  /** Whether sms verification to the account is needed. */
  @Field()
  smsVerificationRequired?: boolean;

  /** Channel used to send message to users. */
  @Field()
  messagingChannel?: MessagingChannel;

  @Field()
  signInMethod?: SignInMethod;

  @Field(voidPropField)
  onAppLoaded?: <T extends this>(options: PropOptions<T>) => void;

  @Field(voidPropField)
  onModelLoaded?: <T extends this>(options: PropOptions<T>) => void;

  @Field(voidPropField)
  onUserLoaded?: <T extends this>(options: PropOptions<T>) => void;
}
