import { CustomViewModel, FormViewModel } from '../..';

export const createNewView: FormViewModel = {
  label: 'Create new view',
  type: 'FormView',
  viewActions: ['submitForm'],
  parent: 'dataGridView',
  formFields: ['name', 'parent', 'label', 'icon', 'parentMenu', 'category', 'datasource', 'table'],
  fieldGroups: null,
  extraFieldGroup: null
};

export const createViewWith: CustomViewModel = {
  component: 'DataImporterView',
  width: '1000px',
  type: 'CustomView',
  viewActions: ['save'],
  webActions: [
    {
      name: 'save',
      label: 'Save',
      icon: 'mdi-check',
      execute: ({ viewService }) => viewService.save()
    }
  ]
};

export const createViewWithAI: FormViewModel = {
  label: 'Creating view with AI',
  type: 'FormView',
  viewActions: ['generateModel', 'saveModel'],
  defaultCols: 12,
  fields: [
    {
      name: 'parentMenu',
      type: 'SelectField',
      keyField: 'name',
      labelField: 'label',
      iconField: 'icon',
      required: true,
      optionItems: ({ registry: { navigationService } }) =>
        navigationService.listMenuItems.filter((menuItem) => typeof menuItem.children != 'function')
    },
    {
      name: 'category',
      type: 'SelectField',
      allowInputText: true,
      newValueMode: 'add-unique',
      optionItems: ({ registry: { modelService } }) => modelService.getCategories()
    },
    { name: 'entities', type: 'StringField' },
    { name: 'description', type: 'TextField' },
    { name: 'keyFields', type: 'TextField' },
    { name: 'keyRelations', type: 'TextField' },
    { name: 'modelCode', type: 'ScriptField', language: 'typescript', height: '600px' }
  ],
  webActions: [
    {
      name: 'saveModel',
      icon: 'mdi-content-save',
      execute: async ({ data, registry: { dataService, uiService } }) => {
        const views = eval(data.modelCode);
        for (const view of views) view.category = data.category;

        await dataService.save({
          view: 'views',
          data: views
        });

        setTimeout(() => uiService.openRoute({ view: '/' + views[0].name }), 500);
      }
    },
    {
      name: 'generateModel',
      icon: 'mdi-wrench',
      execute: async ({ data, registry: { httpClient, common } }) => {
        const fields = ['category', 'entities', 'description', 'keyFields', 'keyRelations'];
        for (const field of fields) {
          if (common.containsLang('ko', data[field])) {
            data[field] = await httpClient.post('aiService/translate', {
              message: data[field],
              from: 'ko',
              to: 'en'
            });
          }
        }

        const response = await httpClient.post('codeAiService/createViewWithAI', data);
        data.modelCode = response;
      }
    }
  ]
};

export const aiModelStudio: FormViewModel = {
  label: 'AI Model Studio',
  icon: 'mdi-crane',
  type: 'FormView',
  viewActions: ['editExample', 'generateModel', 'generatedAsInput', 'saveModel'],
  fields: [
    {
      name: 'category',
      type: 'SelectField',
      allowInputText: true,
      newValueMode: 'add-unique',
      optionItems: ({ registry: { modelService } }) => modelService.getCategories(),
      onChange: async ({ data, registry: { modelService, common } }) => {
        if (!data.category) return;
        const views = modelService.model.views.filter((view) => view.category == data.category);
        data.modelCode = common.jsSerializer.serialize(views, { ignoreStartsWith: '$' });
        data.modelCode = common.formatJs(data.modelCode);
      }
    },
    {
      name: 'parentMenu',
      type: 'SelectField',
      keyField: 'name',
      labelField: 'label',
      iconField: 'icon',
      required: true,
      optionItems: ({ registry: { navigationService } }) =>
        navigationService.listMenuItems.filter((menuItem) => typeof menuItem.children != 'function')
    },
    { name: 'description', type: 'TextField', cols: 12 },
    {
      name: 'modelCode',
      label: 'Input model',
      type: 'ScriptField',
      language: 'typescript',
      cols: 6,
      configure: ({ model, registry: { uiService } }) => {
        model.height = uiService.screen.height - 220 + 'px';
      }
    },
    {
      name: 'generatedModel',
      type: 'ScriptField',
      language: 'typescript',
      height: '100%',
      cols: 6,
      configure: ({ model, registry: { uiService } }) => {
        model.height = uiService.screen.height - 220 + 'px';
      }
    }
  ],
  async onMounted({ registry: { httpClient, uiService }, data }) {
    void uiService.openRightView({ view: 'chatbot' });
    data.modelCode = '';
    data.generatedModel = '';
    data.exampleModel = await httpClient.post('codeAiService/getTemplate', 'viewModels');
  },
  webActions: [
    {
      name: 'saveModel',
      hint: '',
      icon: 'mdi-content-save',
      execute: async ({ data, registry: { dataService, uiService } }) => {
        const views = eval(data.generatedModel);

        await dataService.save({
          view: 'views',
          data: views
        });

        const lastView = views[views.length - 1];
        setTimeout(() => uiService.openRoute({ view: '/' + lastView.name }), 500);
      },
      disabled: ({ data }) => !data.generatedModel
    },
    {
      name: 'generateModel',
      icon: 'mdi-crane',
      execute: async ({ data, registry: { httpClient, common } }) => {
        const translateFields = ['requirements'];
        for (const field of translateFields) {
          if (common.containsLang('ko', data[field])) {
            data[field] = await httpClient.post('aiService/translate', {
              message: data[field],
              from: 'ko',
              to: 'en'
            });
          }
        }

        const response = await httpClient.post('codeAiService/generateModel', data);
        data.generatedModel = response;
      }
    },
    {
      name: 'generatedAsInput',
      icon: 'mdi-content-copy',
      execute: async ({ data }) => {
        data.modelCode = data.generatedModel;
      },
      disabled: ({ data }) => !data.generatedModel
    },
    {
      name: 'editExample',
      icon: 'mdi-note-edit',
      execute: async ({ data, registry: { uiService } }) => {
        const result = await uiService.openModal({
          view: {
            type: 'ScriptView',
            label: 'Edit Example Model',
            hint: 'Example Model is only referenced when Input model is less than 100 characters.',
            width: '800px',
            height: '600px'
          },
          data: data.exampleModel
        });
        if (result) data.exampleModel = result;
      }
    }
  ]
};
