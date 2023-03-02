import { DataGridViewModel } from 'app2-common';

export const taskFollowers: DataGridViewModel = {
  type: 'DataGridView',
  parent: 'spaceBase',
  table: 'space_task_follower',
  indexes: [{ name: 'uk_OcTaskFollower', indexType: 'UNIQUE', fields: ['task', 'follower'] }],
  columnFields: ['task', 'follower', 'createdBy', 'updatedAt'],
  fields: [
    { name: 'task', type: 'LookupField', relatedView: 'tasks', required: true },
    { name: 'follower', type: 'LookupField', relatedView: 'users', required: true }
  ]
};
