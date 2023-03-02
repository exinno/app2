import { DataGridViewModel, SectionViewModel } from 'app2-common';

export const members: DataGridViewModel = {
  parent: 'users',
  label: 'Members',
  labelField: 'displayName',
  orderBy: [{ field: 'updatedAt', direction: 'desc' }],
  columnFields: ['name', 'displayName', 'email', 'timeZone', 'updatedAt'],
  detailView: 'memberDetail',
  fields: [
    { name: 'name', label: 'ID', type: 'StringField' },
    { name: 'timezone', label: 'TimeZone', type: 'LookupField', relatedView: 'timezones' },
    { name: 'active', label: 'Active', type: 'CheckboxField' },
    {
      name: 'memberGroups',
      label: 'Assigned Groups',
      type: 'LookupField',
      mappingView: 'groupMembers',
      mappingField: 'member',
      relatedView: 'groups',
      relatedField: 'group',
      multiple: true
    }
  ]
};

export const memberDetail: SectionViewModel = {
  type: 'SectionView',
  label: 'Members',
  hideToolbar: true,
  children: [
    {
      type: 'FormView',
      parent: 'members',
      viewActions: ['submitForm'],
      formFields: ['name', 'displayName', 'email', 'timeZone', 'updatedAt', 'memberGroups']
    },
    {
      type: 'TabView',
      hideToolbar: true,
      defaultTab: 'memberTasks',
      hidden: ({ dataId }) => dataId == '$new',
      children: ['memberTasks', 'memberPosts']
    }
  ]
};

export const memberTasks: DataGridViewModel = {
  parent: 'tasks',
  defaultData: ({ route }) => ({ requester: route.params.dataId }),
  filter: ({ route }) => ({ field: 'requester', value: route.params.dataId })
};

export const memberPosts: DataGridViewModel = {
  parent: 'posts',
  filter: ({ route }) => ({ field: 'createdBy', value: route.params.dataId })
};
