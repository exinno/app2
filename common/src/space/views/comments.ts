import { CommentViewModel } from '../../../';

export const comments: CommentViewModel = {
  type: 'CommentView',
  parent: 'owned',
  mixins: ['likeable'],
  label: 'Comments',
  table: 'OcComment',
  acl: 'authRead',
  ownerField: 'createdBy',
  aclByRecord: true,
  includePermissions: true,
  livePrepend: true,
  pageSize: 10,
  clickable: false,
  separator: false,
  infiniteScrollReverse: true,
  infiniteScrollStyle: 'display: flex; flex-direction: column-reverse',
  hideLoadingSpinner: true,
  viewActions: ['refresh'],
  filter: ({ dataId, model }) => ({ dataView: model.dataView, dataId }),
  orderBy: [{ field: 'createdAt', direction: 'desc' }],
  select: ['likeCount', 'liked', 'dataView'],
  listSections: [
    [
      {
        listFields: ['createdBy.picture'],
        avatar: true,
        onClick: () => {
          console.log('Comment avatar click!');
        }
      },
      {
        listFields: ['createdBy.displayName', 'message'],
        sectionStyle: "overflow: 'hidden'"
      },
      {
        listFields: ['createdAt', 'actions'],
        side: true
      }
    ]
  ],
  detailView: {
    type: 'FormView',
    formFields: ['message']
  },
  fields: [
    { name: 'dataView', label: 'View', type: 'StringField' },
    { name: 'dataId', label: 'Data ID', type: 'StringField' },
    {
      name: 'message',
      label: 'Message',
      type: 'TextField',
      cols: 12,
      cellStyle: { overflow: 'hidden' }
    },
    {
      name: 'actions',
      label: 'Actions',
      type: 'ActionField',
      actionSize: 'sm',
      laidCount: 1,
      actions: ['toggleLike', 'openRemove', 'openEdit']
    },
    { name: 'createdAt', label: 'Created', type: 'DateField', editable: false, creatable: false, fromNow: true }
  ]
};
