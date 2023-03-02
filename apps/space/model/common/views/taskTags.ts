import { DataGridViewModel } from 'app2-common';

export const taskTags: DataGridViewModel = {
  parent: 'spaceBase',
  table: 'space_task_tag',
  indexes: [{ name: 'uk_OcTaskTag', indexType: 'UNIQUE', fields: ['task', 'tag'] }],
  columnFields: ['task', 'tag', 'createdBy', 'updatedAt'],
  fields: [
    { name: 'task', type: 'LookupField', relatedView: 'tasks', required: true },
    { name: 'tag', type: 'LookupField', relatedView: 'tags', required: true }
  ]
};
