import { DataGridViewModel, FormViewModel } from 'index';

export const dataGroup: FormViewModel = {
  type: 'FormView',
  label: 'Group',
  noServer: true,
  fields: [
    {
      type: 'DataGridField',
      name: 'rowGroupView',
      label: 'RowGroup',
      cols: 12,
      defaultValue: [],
      dataGridModel: {
        viewActions: ['add'],
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
            optionItems: ({ registry, viewService }) => {
              const parentViewModel: DataGridViewModel = viewService.parentView.model;
              const rowFields = registry.callProp<string[]>(parentViewModel, 'rowFields');

              return parentViewModel.fields.filter((field) => rowFields.includes(field.name));
            }
          },
          {
            name: 'actions',
            type: 'ActionField',
            actions: ['openRemove'],
            cellEditorAsRender: true
          }
        ]
      }
    },
    {
      type: 'DataGridField',
      name: 'valueColumnView',
      label: 'ValueColumn',
      cols: 12,
      defaultValue: [],
      dataGridModel: {
        viewActions: ['add'],
        fields: [
          {
            name: 'field',
            label: 'Field',
            type: 'SelectField',
            keyField: 'name',
            labelField: 'label',
            width: 160,
            cellEditorAsRender: true,
            required: true,
            optionItems: ({ registry, viewService }) => {
              const parentViewModel: DataGridViewModel = viewService.parentView.model;
              const valueFields = registry.callProp<string[]>(parentViewModel, 'valueFields');

              return parentViewModel.fields.filter((field) => valueFields.includes(field.name));
            }
          },
          {
            name: 'aggFunc',
            label: 'AggFunc',
            type: 'SelectField',
            cellEditorAsRender: true,
            required: true,
            keyField: 'name',
            labelField: 'label',
            optionItems: [
              { name: 'sum', label: 'sum' },
              { name: 'min', label: 'min' },
              { name: 'max', label: 'max' },
              { name: 'avg', label: 'avg' },
              { name: 'count', label: 'count' }
            ]
          },
          {
            name: 'actions',
            type: 'ActionField',
            actions: ['openRemove'],
            cellEditorAsRender: true
          }
        ]
      }
    }
  ]
};
