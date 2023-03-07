import { PivotViewModel } from 'index';

export const activityReport: PivotViewModel = {
  type: 'PivotView',
  label: 'Activity Report',
  parent: 'activities',
  rowFields: ['view', 'activityType'],
  columnFields: (options) => {
    return [options.pageCtx.REPORT_PERIOD];
  },
  valueFields: ['count'],
  select: [{ field: 'count' }],
  viewActions: ['exportExcel', 'designView', 'refresh'],
  fields: [
    {
      name: 'REPORT_PERIOD',
      label: '기간구분',
      type: 'SelectField',
      columnType: null,
      keyField: 'name',
      labelField: 'label',
      defaultValue: 'SERIES_M',
      optionItems: [
        { name: 'SERIES_M', label: '월' },
        { name: 'SERIES_Q', label: '분기' },
        { name: 'SERIES_H', label: '반기' },
        { name: 'SERIES_Y', label: '연도' }
      ]
    },
    {
      name: 'START_MONTH',
      label: '시작월',
      type: 'DateField',
      columnType: null,
      dateType: 'month'
    },
    {
      name: 'END_MONTH',
      label: '종료월',
      type: 'DateField',
      columnType: null,
      dateType: 'month'
    },
    {
      name: 'SERIES_M',
      label: '월',
      type: 'DateField',
      dateType: 'month',
      sql: `date_trunc('month', date("activityDate"))`
    },
    {
      name: 'SERIES_Q',
      label: '분기',
      type: 'DateField',
      dateType: 'month',
      sql: `date_trunc('quarter', date("activityDate"))`
    },
    {
      name: 'SERIES_H',
      label: '반기',
      type: 'DateField',
      dateType: 'month',
      sql: `case when date_part('month', "activityDate") <= 6 then date_trunc('year', "activityDate") else date_trunc('year', "activityDate") + interval '6 month' end`
    },
    {
      name: 'SERIES_Y',
      label: '연도',
      type: 'DateField',
      dateType: 'year',
      sql: `date_trunc('year', date("activityDate"))`
    },
    { name: 'view', type: 'StringField' },
    { name: 'activityType', type: 'StringField' },
    {
      name: 'count',
      label: '건수',
      type: 'NumberField',
      sql: 'count(this.id)'
    }
  ],
  pageFields: ['START_MONTH', 'END_MONTH', 'REPORT_PERIOD'],
  paramFields: ['START_MONTH', 'END_MONTH', 'REPORT_PERIOD'],
  pageCtxDefaultData: ({ registry: { dayjs } }) => {
    return {
      START_MONTH: dayjs().tz().startOf('month'),
      END_MONTH: dayjs().tz().endOf('month'),
      REPORT_PERIOD: 'SERIES_M'
    };
  },
  groupBy: (options) => {
    let groups = [options.params.REPORT_PERIOD];
    const viewModel: PivotViewModel = options.viewModel;

    if (Array.isArray(viewModel.rowFields)) groups = [...viewModel.rowFields, ...groups];

    return groups;
  },
  refreshOnFilterChange: true,
  enableChart: true,
  enableGrid: true,
  nullLabel: '-'
};
