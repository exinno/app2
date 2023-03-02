import { DataGridViewModel, ListViewModel, TimelineViewModel } from '../../../';

export const activities: DataGridViewModel = {
  type: 'DataGridView',
  table: 'OcActivity',
  keyField: 'id',
  keyGenerator: 'random',
  label: 'Activity',
  createdAtField: 'activityDate',
  acl: 'authRead',
  aclByRecord: true,
  allowEditing: false,
  allowAdding: false,
  allowDeleting: false,
  showColumnChooser: false,
  pageFields: ['view', 'activityType'],
  paramFields: ['view', 'activityType'],
  viewActions: ['openView', 'openQueryBuilder', 'exportExcel', 'refresh'],
  pageCtxDefaultData: ({ viewService }) => {
    if (viewService?.parentView) {
      return { view: viewService.parentView.model.name };
    }
  },
  refreshOnFilterChange: true,
  orderBy: [{ field: 'activityDate', direction: 'desc' }],
  fields: [
    { name: 'id', label: 'Id', type: 'StringField', hidden: true },
    { name: 'activityDate', label: 'Activity Date', type: 'DateField', dateType: 'dateTime' },
    {
      name: 'user',
      label: 'Username ',
      type: 'LookupField',
      relatedView: 'users',
      select: ['id', 'displayName', 'picture']
    },
    {
      name: 'view',
      label: 'View',
      type: 'SelectField',
      optionItems: ({ registry: { modelService } }) => {
        return modelService.getViews().map((view) => view.name);
      }
    },
    {
      name: 'activityType',
      label: 'Activity Type',
      type: 'SelectField',
      optionItems: ({ registry: { common } }) => {
        return common.activityTypes;
      }
    },
    { name: 'action', label: 'Action', type: 'StringField' },
    { name: 'dataId', label: 'Data Id', type: 'StringField' },
    { name: 'remoteAddress', label: 'Client Address', type: 'StringField' },
    { name: 'data', label: 'Data', type: 'ScriptField' },
    { name: 'pageCtx', label: 'Param Data', type: 'TextField', cols: 12 },
    { name: 'description', label: 'Description', type: 'TextField', cols: 12 }
  ]
};

export const activityList: ListViewModel = {
  type: 'ListView',
  parent: 'activities',
  label: 'Activity',
  itemClickAction: 'openEdit',
  viewActions: ['openAdd', 'openQueryBuilder'],
  pageFields: [],
  searchFields: ['data'],
  listSections: [
    { listFields: ['activityType'], side: true },
    { listFields: ['data'] },
    { listFields: ['activityDate', 'user'], side: true }
  ]
};

export const activityTimeline: TimelineViewModel = {
  type: 'TimelineView',
  parent: 'activities',
  serverView: 'activities',
  pageSize: 10,
  icon: 'mdi-timeline-clock',
  titleField: 'activityType',
  subtitleField: 'activityDate',
  bodyField: 'data',
  pageFields: [],
  viewActions: []
};
