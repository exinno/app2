import { WebActionModel } from '../../../model';

export const designView: WebActionModel = {
  icon: 'mdi-pencil-ruler',
  actionType: 'overall',
  permission: 'manage',
  ellipsis: true,
  execute: async ({ registry: { uiService }, viewModel, viewService }) => {
    await uiService.openModal({
      view: 'viewDesigner',
      openSize: 'maximized',
      parentView: viewService,
      dataId: viewModel.name
    });
  }
};

export const editFields: WebActionModel = {
  icon: 'mdi-table-edit',
  actionType: 'overall',
  permission: 'manage',
  ellipsis: true,
  execute: async ({ registry: { uiService }, viewModel, viewService }) => {
    await uiService.openModal({
      view: {
        label: 'Edit fields',
        type: 'FormView',
        parent: 'dataGridView',
        viewActions: ['submitForm'],
        formFields: ['name', 'fields', 'columnFields'],
        fieldGroups: null,
        extraFieldGroup: null,
        defaultCols: 12
      },
      parentView: viewService,
      dataId: viewModel.name
    });
  }
};

export const addField: WebActionModel = {
  icon: 'mdi-table-column-plus-after',
  actionType: 'overall',
  permission: 'manage',
  ellipsis: true,
  execute: async ({ registry: { uiService, dataService }, viewModel, viewService }) => {
    const field = await uiService.openModal({
      view: {
        label: 'Add Field',
        parent: 'fieldEditor'
      },
      parentView: viewService
    });
    if (!field) return;
    await dataService.save({
      view: 'views',
      dataId: viewModel.name,
      data: { name: viewModel.name, fields: [...viewModel.fields, field] }
    });
  }
};

export const editField: WebActionModel = {
  icon: 'mdi-table-edit',
  actionType: 'overall',
  permission: 'manage',
  ellipsis: true,
  execute: async ({ registry: { uiService, dataService }, viewModel, viewService, value }) => {
    const fieldIndex = viewModel.fields.findIndex((field) => field.name == value);
    const editedField = await uiService.openModal({
      view: {
        label: 'Edit Field',
        parent: 'fieldEditor'
      },
      parentView: viewService,
      data: viewModel.fields[fieldIndex]
    });
    if (!editedField) return;

    const fields = [...viewModel.fields];
    fields[fieldIndex] = editedField;

    await dataService.save({
      view: 'views',
      dataId: viewModel.name,
      data: { name: viewModel.name, fields }
    });
  }
};

export const generateTestData: WebActionModel = {
  icon: 'mdi-table-plus',
  actionType: 'overall',
  permission: 'manage',
  ellipsis: true,
  execute: async ({ registry: { uiService, httpClient }, viewModel, viewService }) => {
    const options = await uiService.openModal({
      view: {
        type: 'FormView',
        label: 'Generate Test Data',
        viewActions: ['submitForm'],
        fields: [
          { name: 'view', type: 'StringField', defaultValue: viewModel.name, required: true },
          {
            name: 'count',
            hint: 'Number of test data to generate',
            type: 'NumberField',
            required: true,
            defaultValue: 5
          },
          { name: 'requirements', type: 'TextField' }
        ]
      }
    });
    if (!options) return;
    await httpClient.post('codeAiService/generateTestData', options);
    viewService.refresh();
  }
};
