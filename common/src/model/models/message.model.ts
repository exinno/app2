import languages from 'countries-list/dist/languages.json';
import { Model, PropOptions, StringFieldModel } from '..';
import { Field, View } from './model.decorator';

export const languageCodes = Object.keys(languages);
export type LanguageCode = keyof typeof languages;

function langField(language: typeof languages.en): StringFieldModel {
  return { type: 'StringField', label: `${language.name}` };
}

function columnFields({ registry: { modelService } }: PropOptions<any>) {
  return ['name', 'category', ...modelService.config.locales.map((locale) => locale + 'Text')];
}

/**
 * Message(i18n) model
 */
@View({
  type: 'DataGridView',
  name: 'messages',
  table: 'messages',
  parent: 'models',
  editMode: 'Batch',
  allowAdding: true,
  allowEditing: true,
  allowDeleting: true,
  columnFields,
  detailView: {
    type: 'FormView',
    formFields: columnFields
  },
  acl: 'public',
  viewActions: [
    'fillMissing',
    'translate',
    'openEdit',
    'openAdd',
    'openRemove',
    'openQueryBuilder',
    'exportExcel',
    'openActivities',
    'refresh'
  ],
  webActions: [
    {
      name: 'fillMissing',
      icon: 'mdi-file-plus',
      actionType: 'overall',
      execute: async ({ registry: { messageService, uiService }, viewService }) => {
        const result = await messageService.fillMissing();
        uiService.notify({ message: `Added ${result} missing messages.` });
        if (result) viewService.refresh();
      }
    },
    {
      name: 'translate',
      icon: 'mdi-google-translate',
      actionType: 'overall',
      execute: async ({ registry: { messageService, uiService }, viewService }) => {
        const result = await messageService.translate();
        uiService.notify({ message: `${result} messages have been translated into all languages` });
        if (result) viewService.refresh();
      }
    }
  ]
})
export class MessageModel extends Model {
  /** Text in Korean. */
  @Field(langField(languages.ko))
  koText?: string;

  /** Text in English. */
  @Field(langField(languages.en))
  enText?: string;

  /** Text in Chinese. */
  @Field(langField(languages.zh))
  zhText?: string;

  /** Text in Japanese. */
  @Field(langField(languages.ja))
  jaText?: string;

  /** Text in Spanish. */
  @Field(langField(languages.es))
  esText?: string;

  /** Text in French. */
  @Field(langField(languages.fr))
  frText?: string;

  /** Text in German. */
  @Field(langField(languages.de))
  deText?: string;

  /** Text in Arabic. */
  @Field(langField(languages.ar))
  arText?: string;

  /** Text in Russian. */
  @Field(langField(languages.ru))
  ruText?: string;

  /** Text in Portuguese. */
  @Field(langField(languages.pt))
  ptText?: string;

  /** Text in Dutch. */
  @Field(langField(languages.nl))
  nlText?: string;

  /** Text in Vietnamese. */
  @Field(langField(languages.vi))
  viText?: string;

  /** Text in Indonesian. */
  @Field(langField(languages.id))
  idText?: string;

  /** Text in Malay. */
  @Field(langField(languages.ms))
  msText?: string;

  /** Text in Thai. */
  @Field(langField(languages.th))
  thText?: string;
}
