import { DataGridViewModel } from '../../../';

export const spaceBase: DataGridViewModel = {
  type: 'DataGridView',
  parent: 'editable',
  editMode: 'Batch',
  allowAdding: true,
  allowEditing: true,
  allowDeleting: true,
  acl: 'ownerAny',
  aclByRecord: true,
  ownerField: 'createdBy',
  hasGroupPermission: ({ pageCtx, user }) => {
    return pageCtx.spaceId == 'everything' || pageCtx.members?.some((member) => member.id == user.id);
  },
  viewActions: [
    'bookmarkView',
    '--',
    'openAdd',
    'openEdit',
    'openRemove',
    'openQueryBuilder',
    'saveViewAs',
    'saveView',
    'openPermission',
    'refresh'
  ],
  mobileView: {
    type: 'ListView',
    itemClickAction: 'openEdit'
  }
};

export const spaceOwned: DataGridViewModel = {
  name: 'spaceOwned',
  parent: 'spaceBase',
  subLabel: ({ pageCtx }) => pageCtx.space?.name,
  acl: 'groupAny',
  aclByRecord: true,
  groupField: 'space.group',
  fields: [
    {
      name: 'space',
      label: 'Space',
      labelField: 'name',
      type: 'LookupField',
      relatedView: 'spaces',
      cols: 6,
      notNull: true,
      required: true,
      pinned: ({ pageCtx }) => (pageCtx.spaceId == 'everything' ? 'left' : undefined)
    },
    {
      name: 'spaceSelector',
      column: 'space',
      label: 'Spaces',
      labelField: 'name',
      type: 'LookupField',
      relatedView: 'spaces',
      cols: 4,
      multiple: true,
      temporary: true // Duplicate of space field in spaceOwned.
    }
  ]
};
