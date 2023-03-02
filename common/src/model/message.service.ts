import {
  DataService,
  detectLang,
  Dict,
  formatString,
  httpClient,
  AuthService,
  LanguageCode,
  MessageModel,
  Model,
  ModelService,
  ModelType,
  PropOptions,
  registry
} from '..';
import languageList from 'countries-list/dist/languages.json';
import _ from 'lodash';

const FIELD_SUFFIX = 'Text';

export class MessageService {
  constructor(
    protected modelService: ModelService,
    protected dataService: DataService,
    protected authService: AuthService
  ) {}

  private messagesByKey: Dict<MessageModel>;
  private messagesByLang1: Dict<MessageModel>;
  private messagesByLang2: Dict<MessageModel>;
  private missingMessages: MessageModel[] = [];
  private lang1Field: string;
  private lang2Field: string;
  locale: string;
  locales: string[];

  init() {
    const { envInfo } = registry;
    this.locales = this.modelService.config.locales;

    this.lang1Field = this.locales[0] + FIELD_SUFFIX;
    this.lang2Field = this.locales[1] + FIELD_SUFFIX;
    this.messagesByKey = _.keyBy(this.modelService.model.messages, 'name');
    this.messagesByLang1 = _.keyBy(this.modelService.model.messages, this.lang1Field);
    this.messagesByLang2 = _.keyBy(this.modelService.model.messages, this.lang2Field);

    const fixedLocale = this.modelService.config.fixedLocale;
    const locale =
      fixedLocale ??
      this.authService.user?.locale ??
      (envInfo.type == 'browser' ? navigator.language : this.locales[0]);
    const language = locale?.substring(0, 2) as LanguageCode;
    this.locale = this.locales.includes(language) ? language : this.locales[0];
    this.missingMessages = [];
  }

  t(key: string, params?: Dict): string {
    if (!key) return key;
    const isKey = key.startsWith('$');
    if (isKey) key = key.substring(1);
    const messageModel = isKey ? this.messagesByKey[key] : this.messagesByLang1[key] ?? this.messagesByLang2[key];
    if (!messageModel) {
      const langField = (detectLang(key) ?? 'en') + FIELD_SUFFIX;
      if (!this.missingMessages.find((msg) => (isKey ? msg.name : msg[langField]) == key)) {
        const newMessage = {
          name: isKey ? key : _.camelCase(key),
          [langField]: isKey ? _.startCase(key) : key,
          category: 'unclassified'
        };
        this.missingMessages.push(newMessage);
      }
    }
    const message = messageModel?.[this.locale + FIELD_SUFFIX] ?? (isKey ? _.startCase(key) : key);
    const formatted = formatString(message, params);
    return formatted;
  }

  getLabel<M extends Model>(
    model: M,
    modelType: ModelType = model.$modelType ?? 'views',
    props?: Partial<PropOptions<M>>
  ): string {
    if (!model) return '';
    let label;
    if (!model.label && !model.name && model.parent) {
      label = this.getLabel(this.modelService.get(model.parent, modelType), modelType, props);
    } else {
      try {
        label = this.modelService.callProp(model, 'label', props);
      } catch {
        label = model.name;
      }
    }

    if (label != null) {
      return this.t(label, model);
    } else if (model.name) {
      return this.t(`$${model.name}`, model);
    } else {
      return undefined;
    }
  }

  async fillMissing(): Promise<number> {
    if (!this.missingMessages.length) return 0;
    const result = await httpClient.post('messageService/fillMissing', this.missingMessages);
    this.missingMessages = [];
    return result;
  }

  async translate() {
    return await httpClient.post('messageService/translate');
  }

  get localeOptions() {
    // TODO: 지역이 결함된 locale로 나와야함 (eg. zh 중국어 - 대만은 번체 중국은 간체)
    return this.locales.map((lang) => ({
      name: lang,
      label: this.getLanguageLabel(lang)
    }));
  }

  getLanguageLabel(lang: string): string {
    const language = languageList[lang];
    return language.name == language.native ? language.name : `${language.native} (${language.name})`;
  }

  async changeLocale(locale: string) {
    this.locale = locale;
    if (this.authService.user) {
      await this.authService.updateUser({ locale });
      this.authService.user.locale = locale;
    }
  }
}
