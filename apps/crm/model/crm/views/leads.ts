import { DataGridViewModel } from 'app2-common';

export const crmLeads: DataGridViewModel = {
  type: 'DataGridView',
  hint: 'Prospective customers or clients that have shown interest in the business',
  parent: 'crmBase',
  label: 'Leads',
  table: 'crm_leads',
  labelField: 'name',
  fields: [
    { name: 'name', label: 'Name', type: 'StringField', hint: 'Name of the lead', required: true, cols: 12 },
    { name: 'account', type: 'LookupField', relatedView: 'crmAccounts' },
    { name: 'contact', type: 'LookupField', relatedView: 'crmContacts' },
    { name: 'description', label: 'Description', type: 'TextField', hint: 'Description the lead' },
    {
      name: 'source',
      label: 'Source',
      type: 'SelectField',
      optionItems: ['website', 'social media', 'referral', 'advertising', 'trade show', 'cold call', 'email', 'other'],
      hint: 'Origin or source of the lead, used to track where the lead came from and which marketing efforts are most effective.'
    },
    {
      name: 'status',
      label: 'Status',
      type: 'SelectField',
      optionItems: ['new', 'qualified', 'contacted,', 'converted,', 'closed.'],
      hint: 'Current stage or status of the lead in the sales process.'
    },
    {
      name: 'activities',
      type: 'DataGridField',
      relatedView: 'activities',
      relatedField: 'dataId',
      hint: 'Activities associated with the lead'
    },
    {
      name: 'crmCases',
      type: 'DataGridField',
      relatedView: 'crmCases',
      relatedField: 'lead',
      hint: 'Cases associated with the lead'
    }
  ]
};
