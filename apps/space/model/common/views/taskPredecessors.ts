import { DataGridViewModel } from 'app2-common';

export const taskPredecessors: DataGridViewModel = {
  type: 'DataGridView',
  parent: 'spaceBase',
  table: 'space_task_predecessor',
  indexes: [{ name: 'uk_space_task_predecessor', indexType: 'UNIQUE', fields: ['task', 'predecessor'] }],
  columnFields: ['task', 'predecessor', 'createdBy', 'updatedAt'],
  fields: [
    { name: 'task', type: 'LookupField', relatedView: 'tasks', required: true },
    { name: 'predecessor', type: 'LookupField', relatedView: 'tasks', required: true }
  ]
};
