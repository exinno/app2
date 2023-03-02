import { DataGridViewModel } from 'app2-common';

export const tags: DataGridViewModel = {
  parent: 'spaceBase',
  label: 'Tags',
  table: 'space_tag',
  labelField: 'name',
  indexes: [{ name: 'uk_OcTag', indexType: 'UNIQUE', fields: ['name'] }],
  fields: [{ name: 'name', label: 'Name', type: 'StringField' }]
};
