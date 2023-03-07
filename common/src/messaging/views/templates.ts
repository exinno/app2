import { DataGridViewModel } from '../../../';

export const templates: DataGridViewModel = {
  type: 'DataGridView',
  parent: 'editable',
  table: 'OcTemplate',
  label: 'Templates',
  labelField: 'subject',
  fields: [
    { name: 'subject', type: 'StringField', required: true },
    { name: 'name', type: 'StringField', required: true },
    { name: 'from', type: 'StringField' },
    { name: 'contentType', type: 'ChoiceField', choice: 'contentType' },
    { name: 'content', type: 'StringField', inputType: 'textarea', cols: 12, required: true },
    { name: 'defaultParams', type: 'PropField', propType: 'Dict', cols: 12 }
  ]
};
