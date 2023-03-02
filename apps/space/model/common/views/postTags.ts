import { DataGridViewModel } from 'app2-common';

export const postTags: DataGridViewModel = {
  type: 'DataGridView',
  parent: 'spaceBase',
  table: 'space_post_tag',
  indexes: [{ name: 'uk_OcPostTag', indexType: 'UNIQUE', fields: ['post', 'tag'] }],
  columnFields: ['post', 'tag', 'createdBy', 'updatedAt'],
  fields: [
    { name: 'post', type: 'LookupField', relatedView: 'tasks', required: true },
    { name: 'tag', type: 'LookupField', relatedView: 'tags', required: true }
  ]
};
