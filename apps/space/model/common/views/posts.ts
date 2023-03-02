import { ListViewModel, FormViewModel, DataGridViewModel } from 'app2-common';

export const posts: ListViewModel = {
  label: 'Forum',
  icon: 'mdi-bulletin-board',
  type: 'ListView',
  parent: 'spaceOwned',
  mixins: ['likeable'],
  labelField: 'title',
  table: 'space_post',
  acl: 'groupRead',
  pageSize: 10,
  includePermissions: true,
  hideToolbar: false,
  detailView: 'postDetail',
  clickable: false,
  separator: true,
  pageFields: ['inputPost'],
  select: ['likeCount', 'liked', 'commentCount'],
  orderBy: [{ field: 'createdAt', direction: 'desc' }],
  listSections: [
    [
      {
        listFields: ['createdBy.picture'],
        avatar: true,
        onClick: () => {
          console.log('Post avatar click!');
        }
      },
      {
        listFields: ['createdBy.displayName', 'title']
      },
      {
        side: true,
        listFields: ['createdAt', 'actions']
      }
    ],
    [{ listFields: ['description'] }]
  ],
  fields: [
    {
      name: 'inputPost',
      type: 'StringField',
      label: '',
      temporary: true,
      placeholder: 'Register new post',
      outlined: true,
      dense: true,
      cols: 12,
      onClick: async ({ registry: { uiService } }) => {
        await uiService.openModal({
          view: {
            type: 'FormView',
            parent: 'postDetail',
            viewActions: ['submitForm']
          },
          dataId: '$new'
        });
      }
    },
    {
      name: 'title',
      label: 'Title',
      type: 'StringField',
      cols: 12,
      required: true,
      cellStyle: { 'font-weight': 'bold' }
    },
    { name: 'description', label: 'Description', type: 'RichTextField', cols: 12 },
    { name: 'postType', label: 'PostType', type: 'ChoiceField', choice: 'postType', defaultValue: 'info' },
    {
      name: 'tags',
      type: 'LookupField',
      mappingView: 'postTags',
      mappingField: 'post',
      relatedView: 'tags',
      relatedField: 'tag',
      multiple: true,
      newValueMode: 'add-unique'
    },
    { name: 'createdAt', label: 'Created', type: 'DateField', editable: false, creatable: false, fromNow: true },
    {
      name: 'actions',
      label: 'Actions',
      type: 'ActionField',
      actionSize: 'sm',
      laidCount: 2,
      actions: ['openComments', 'toggleLike', 'openRemove', 'openEdit']
    },
    {
      name: 'commentCount',
      label: 'Comment Count',
      type: 'NumberField',
      sql: ({ viewModel, knex }) =>
        knex.count().from('OcComment').where('dataId', knex.raw('this.id')).where('dataView', viewModel.name)
    }
  ]
};

export const postListGrid: DataGridViewModel = {
  type: 'DataGridView',
  parent: 'posts',
  columnFields: ['title', 'description', 'postType', 'createdBy', 'updatedAt'],
  pageFields: [],
  allowEditing: false,
  allowAdding: false,
  allowDeleting: false
};

export const simplePostList: ListViewModel = {
  type: 'ListView',
  parent: 'posts',
  hideActionLabel: true,
  pageFields: [],
  clickable: true,
  itemClickAction: 'openView',
  listSections: [
    {
      listFields: ['createdBy.picture'],
      avatar: true
    },
    {
      listFields: ['createdBy.displayName', 'title']
    },
    {
      side: true,
      listFields: ['createdAt']
    },
    { listFields: ['actions'], side: true }
  ],
  fields: [
    {
      type: 'ActionField',
      name: 'actions',
      actions: ['removeAttachedItem']
    }
  ]
};

export const postDetail: FormViewModel = {
  name: 'postDetail',
  type: 'FormView',
  label: 'Post Detail',
  parent: 'posts',
  serverView: 'posts',
  pageFields: [],
  viewActions: ['openComments', 'submitForm'],
  formFields: ['space', 'title', 'description', 'postType', 'tags', 'createdBy', 'updatedAt']
};
