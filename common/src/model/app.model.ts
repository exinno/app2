import {
  AnyFieldModel,
  AuthModel,
  ChatIntentModel,
  ChoiceModel,
  ConfigModel,
  DatasourceModel,
  NavigationModel,
  MessageModel,
  ServerActionModel,
  ValidatorModel,
  ViewModel,
  WebActionModel
} from '..';

export class AppModel {
  appName: string;
  env: string;
  config: ConfigModel;
  auth: AuthModel;
  navigation: NavigationModel;
  datasources: DatasourceModel[] = [];
  views: ViewModel[] = [];
  fields: AnyFieldModel[] = [];
  validators: ValidatorModel[] = [];
  choices: ChoiceModel[] = [];
  messages: MessageModel[] = [];
  serverActions: ServerActionModel[] = [];
  webActions: WebActionModel[] = [];
  chatIntents: ChatIntentModel[] = [];
  categories: string[] = [];
}

export const modelTypes = [
  'datasources',
  'views',
  'fields',
  'validators',
  'choices',
  'messages',
  'serverActions',
  'webActions',
  'templates',
  'chatIntents'
] as const;
export type ModelType = typeof modelTypes[number];
export function isModelType(value: any): value is ModelType {
  return modelTypes.includes(value);
}

export const singleModelTypes = ['config', 'auth', 'navigation'];
export type SingleModelType = typeof singleModelTypes[number];
export function isSingleModelType(value: any): value is SingleModelType {
  return singleModelTypes.includes(value);
}
