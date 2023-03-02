import { DataGridViewModel } from 'app2-common';

export const timezones: DataGridViewModel = {
  type: 'DataGridView',
  keyField: 'abbreviation',
  label: 'Timezones',
  table: 'space_timezone',
  labelField: 'name',
  orderBy: [{ field: 'name', direction: 'asc' }],
  live: true,
  allowAdding: true,
  allowEditing: true,
  allowDeleting: false,
  showColumnChooser: false,
  aclByRecord: true,
  fields: [
    { name: 'abbreviation', label: 'Abbreviation', type: 'StringField' },
    { name: 'name', label: 'Name', type: 'StringField' },
    { name: 'offset', label: 'Offset', type: 'StringField' }
  ]
};
