import { DataGridViewModel } from 'app2-common';

export const taskTasks: DataGridViewModel = {
  parent: 'spaceBase',
  table: 'space_task_task',
  indexes: [{ name: 'uk_OcTaskTasks', indexType: 'UNIQUE', fields: ['task', 'childTask'] }],
  columnFields: ['task', 'childTask', 'createdBy', 'updatedAt'],
  fields: [
    { name: 'task', type: 'LookupField', relatedView: 'tasks', required: true },
    { name: 'childTask', type: 'LookupField', relatedView: 'tasks', required: true }
  ]
};
