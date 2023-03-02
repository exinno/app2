import { DataGridService, DataGridViewModel } from '../../../';

export const dataFilter: DataGridViewModel = {
  label: 'Filter',
  type: 'DataGridView',
  width: '600px',
  height: '500px',
  noServer: true,
  viewActions: ['add', 'applyFilter'],
  hideActionLabel: true,
  fields: [
    {
      name: 'field',
      label: 'Field',
      type: 'SelectField',
      keyField: 'name',
      labelField: 'label',
      width: 200,
      cellEditorAsRender: true,
      required: true,
      optionItems: ({ viewService }) => viewService.parentView.model.fields,
      onChange: ({ data }) => {
        data.operator = 'eq';
        data.value = null;
      }
    },
    {
      name: 'operator',
      label: 'Operator',
      type: 'SelectField',
      cellEditorAsRender: true,
      required: true,
      keyField: 'name',
      labelField: 'label',
      optionItems: ({ registry, data, viewService }) => {
        const { modelService } = registry;
        const fields = modelService.getFields(viewService.parentView.model);
        const field = fields.find((field) => field.name === data.field);
        if (!field) return [];

        const commonOperators = [
          { name: 'eq', label: 'equals' },
          { name: 'ne', label: 'notEqual' },
          { name: 'null', label: 'null' },
          { name: 'notNull', label: 'notNull' }
        ];
        const textOperators = [
          ...commonOperators,
          { name: 'contains', label: 'contains' },
          { name: 'notContains', label: 'notContains' },
          { name: 'startsWith', label: 'startsWith' },
          { name: 'endsWith', label: 'endsWith' }
        ];
        const compareOperators = [
          ...commonOperators,
          { name: 'gt', label: 'greaterThan' },
          { name: 'gte', label: 'greaterThanOrEqual' },
          { name: 'lt', label: 'lessThan' },
          { name: 'lte', label: 'lessThanOrEqual' },
          { name: 'between', label: 'between' }
        ];

        const operators = {
          string: textOperators,
          text: textOperators,
          decimal: compareOperators,
          float: compareOperators,
          boolean: [
            { name: 'null', label: 'null' },
            { name: 'true', label: 'true' },
            { name: 'false', label: 'false' }
          ],
          date: [...compareOperators]
        };

        return operators[field.columnType];
      }
    },
    {
      name: 'value',
      label: 'Value',
      type: 'CustomField',
      singleClickEdit: true,
      configure: ({ registry, data, viewService, model }) => {
        if (!data) return;
        const { modelService } = registry;
        const fields = modelService.getFields(viewService.parentView.model);
        const field = fields.find((field) => field.name === data.field);
        // model.type = 'StringField'; TODO: why?
        Object.assign(model, field);
      }
    },
    {
      name: 'actions',
      type: 'ActionField',
      actions: ['openRemove'],
      cellEditorAsRender: true
    }
  ],
  webActions: [
    {
      name: 'applyFilter',
      label: 'Apply Filter',
      icon: 'mdi-check',
      actionType: 'overall',
      execute: ({ viewService }) => {
        const parentView = viewService.parentView as any;
        const filters = (viewService as DataGridService).data;

        parentView.setFilter(filters);
      }
    }
  ]
};
