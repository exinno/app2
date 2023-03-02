import {
  DataGridViewModel,
  TabViewModel,
  ListViewModel,
  CalendarViewModel,
  KanbanViewModel,
  GanttViewModel
} from 'app2-common';

export const tasks: DataGridViewModel = {
  type: 'DataGridView',
  parent: 'spaceOwned',
  viewGroup: 'tasks',
  label: 'Tasks',
  icon: 'mdi-format-list-checkbox',
  labelField: 'title',
  table: 'space_task',
  selectionMode: 'Cell',
  ownerField: 'assignee',
  live: true,
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
    'exportExcel',

    'refresh'
  ],
  columnFields: [
    'space',
    'title',
    'status',
    'requester',
    'requested',
    'dueDate',
    'assignee',
    'taskType',
    'priority',
    'tags',
    'createdBy',
    'updatedAt',
    'parentTask',
    'sequence'
  ],
  searchFields: ['title', 'description'],
  sortFields: ['title'],
  detailView: 'taskDetail',
  mobileView: 'taskList',
  // groupingFields: ['status'],
  allowGrouping: true,
  showColumnMenu: true,
  showColumnChooser: true,
  pageFields: ({ pageCtx }) => (pageCtx.spaceId == 'everything' ? ['spaceSelector'] : []),
  paramFields: ['spaceId'],
  filterFields: ['spaceSelector'],
  refreshOnFilterChange: true,
  sequenceField: 'sequence',
  filter: ({ pageCtx }) => ({ space: pageCtx.spaceId == 'everything' ? pageCtx.spaceSelector : pageCtx.spaceId }),
  defaultData: ({ pageCtx }) => ({ space: pageCtx.spaceId == 'everything' ? undefined : pageCtx.spaceId }),
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'StringField',
      cols: 12,
      required: true,
      listFieldHeader: true,
      width: '400px'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'RichTextField',
      height: '350px',
      cols: 12,
      listFieldCaption: true
    },
    {
      name: 'requester',
      label: 'Requester',
      type: 'LookupField',
      relatedView: 'users',
      actions: ['openLookupAdd', 'openLookupEdit']
    },
    {
      name: 'requested',
      label: 'Requested',
      type: 'DateField'
    },
    { name: 'taskType', label: 'TaskType', type: 'ChoiceField', choice: 'taskType', defaultValue: 'task' },
    { name: 'priority', label: 'Priority', type: 'ChoiceField', choice: 'priority', defaultValue: 'normal' },
    { name: 'status', label: 'Status', type: 'ChoiceField', choice: 'status', defaultValue: 'open' },
    { name: 'assignee', label: 'Assignee', type: 'LookupField', relatedView: 'users' },
    { name: 'dueDate', label: 'Due Date', type: 'DateField' },
    {
      name: 'followers',
      label: 'Followers',
      type: 'LookupField',
      mappingView: 'taskFollowers',
      mappingField: 'task',
      relatedView: 'users',
      relatedField: 'follower',
      multiple: true,
      cols: 6
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'LookupField',
      mappingView: 'taskTags',
      mappingField: 'task',
      relatedView: 'tags',
      relatedField: 'tag',
      multiple: true,
      cols: 6,
      newValueMode: 'add-unique'
    },
    {
      name: 'parentTask',
      label: 'Parent Task',
      labelField: 'title',
      type: 'LookupField',
      relatedView: 'tasks',
      cols: 6
    },
    {
      name: 'subTask',
      label: 'Sub Task',
      labelField: 'title',
      type: 'LookupField',
      relatedView: 'tasks',
      relatedField: 'parentTask',
      cols: 6,
      multiple: true
    },
    {
      type: 'UppyAttachmentField',
      name: 'attach',
      label: 'Attachment',
      thumbnail: true,
      allowedFileTypes: ['image/*'],
      cols: 12
    },
    {
      label: 'Predecessors',
      name: 'predecessors',
      type: 'LookupField',
      mappingView: 'taskPredecessors',
      mappingField: 'task',
      relatedView: 'tasks',
      relatedField: 'predecessor',
      multiple: true,
      cols: 6
    },
    {
      name: 'sequence',
      type: 'NumberField',
      columnType: 'decimal',
      label: 'Sequence',
      hidden: true,
      defaultValue: ({ registry: { dayjs } }) => dayjs().unix()
    },
    {
      name: 'fileAttachments',
      type: 'ViewField',
      cols: 12,
      view: {
        type: 'AttachmentView',
        serverView: 'tasks',
        attachField: 'fileAttachments',
        attachView: 'files',
        selectView: 'files',
        listView: 'attachedFileList',
        viewActions: ['attach']
      }
    },
    {
      name: 'relatedTasks',
      type: 'ViewField',
      cols: 12,
      view: {
        type: 'AttachmentView',
        serverView: 'tasks',
        attachField: 'relatedTasks',
        attachView: 'tasks',
        selectView: 'tasks',
        listView: 'attachedTaskList',
        viewActions: ['selectAttach']
      }
    },
    {
      name: 'relatedPosts',
      type: 'ViewField',
      cols: 12,
      view: {
        type: 'AttachmentView',
        serverView: 'tasks',
        attachField: 'relatedPosts',
        attachView: 'posts', // selectView 정보로 server를 받아서 자동으로 박아 주도록 바꿔줘야 함
        selectView: 'postListGrid',
        listView: 'simplePostList',
        viewActions: ['selectAttach']
      }
    }
  ]
};

export const taskList: ListViewModel = {
  type: 'ListView',
  parent: 'tasks',
  itemClickAction: 'openEdit',
  listSections: [
    {
      side: true,
      listFields: ['status', 'priority', 'assignee']
    },
    {
      listFields: ['title']
    },
    {
      side: true,
      listFields: ['requester', 'requested']
    }
  ]
};

export const attachedTaskList = {
  type: 'ListView',
  parent: 'tasks',
  itemClickAction: 'openEdit',
  listSections: [
    {
      side: true,
      listFields: ['status', 'priority', 'assignee']
    },
    {
      listFields: ['title']
    },
    {
      listFields: ['requester', 'requested']
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

export const taskDetail: TabViewModel = {
  type: 'TabView',
  hideToolbar: true,
  bottomTabs: false,
  defaultTab: 0,
  children: [
    {
      label: 'Task',
      icon: 'mdi-format-list-checkbox',
      type: 'FormView',
      pageFields: [],
      formFields: [
        'status',
        'requester',
        'parentTask',
        'predecessors',
        'space',
        'title',
        'description',
        'requested',
        'dueDate',
        'taskType',
        'priority',
        'subTask',
        'assignee',
        'followers',
        'tags',
        'fileAttachments',
        'relatedTasks',
        'relatedPosts',
        'sequence'
      ],
      parent: 'tasks',
      viewActions: ['openComments', 'submitForm']
    },
    {
      label: 'Timeline',
      type: 'TimelineView',
      parent: 'spaceTimeline',
      icon: 'mdi-timeline-clock',
      titleField: 'user.displayName',
      subtitleField: 'activityDate',
      bodyField: 'data',
      hidden: ({ dataId }) => dataId == '$new',
      filter: ({ dataId }) => ({ view: 'tasks', dataId })
    }
  ]
};

export const kanban: KanbanViewModel = {
  type: 'KanbanView',
  label: 'Kanban',
  icon: 'mdi-view-column',
  parent: 'tasks',
  serverView: 'tasks',
  groupField: 'status',
  headerField: 'title',
  contentField: 'description',
  mobileView: null,
  searchFields: ['title'],
  detailView: {
    type: 'FormView'
  },
  live: true
};

export const calendar: CalendarViewModel = {
  type: 'CalendarView',
  label: 'Calendar',
  icon: 'mdi-calendar',
  parent: 'tasks',
  serverView: 'tasks',
  startDateField: 'requested',
  endDateField: 'dueDate',
  contentField: 'description',
  defaultCalenderType: 'Month',
  mobileView: null,
  detailView: {
    type: 'FormView'
  }
};

export const gantt: GanttViewModel = {
  type: 'GanttView',
  label: 'Gantt',
  icon: 'mdi-chart-gantt',
  parent: 'tasks',
  serverView: 'tasks',
  startDateField: 'requested',
  endDateField: 'dueDate',
  childrenField: 'subTask',
  selectionMode: 'Cell',
  detailView: {
    type: 'FormView'
  }
};

export const treeGrid: DataGridViewModel = {
  type: 'DataGridView',
  label: 'Task(Tree)',
  icon: 'mdi-file-tree-outline',
  parent: 'tasks',
  serverView: 'tasks',
  selectionMode: 'Cell',
  keyField: 'id',
  parentDataField: 'parentTask',
  treeColumnIndex: 0,
  allowRowDragAndDrop: true,
  isTreeGrid: true,
  detailView: 'taskDetail'
};
