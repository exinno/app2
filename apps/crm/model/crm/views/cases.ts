import { DataGridViewModel } from 'app2-common';

export const crmCases: DataGridViewModel = {
  type: 'DataGridView',
  hint: 'Issues or customer inquiries that need to be resolved',
  parent: 'crmBase',
  label: 'Cases',
  table: 'crm_cases',
  labelField: 'name',
  fields: [
    { name: 'name', label: 'Name', type: 'StringField', hint: 'Name of the case', required: true },
    { name: 'account', type: 'LookupField', relatedView: 'crmAccounts', hint: 'Account associated with the case' },
    { name: 'contact', type: 'LookupField', relatedView: 'crmContacts', hint: 'Contact associated with the case' },
    { name: 'lead', type: 'LookupField', relatedView: 'crmLeads', hint: 'Lead associated with the case' },
    { name: 'description', label: 'Description', type: 'TextField', hint: 'Description of the case' },
    {
      name: 'status',
      label: 'Status',
      type: 'SelectField',
      optionItems: ['new', 'in progress', 'on hold', 'resolved', 'closed'],
      hint: 'Current stage or status of the case'
    },
    {
      name: 'priority',
      label: 'Priority',
      type: 'SelectField',
      optionItems: ['high', 'medium', 'low'],
      hint: 'Priority level of the case'
    },
    {
      name: 'assignedTo',
      label: 'Assigned To',
      type: 'LookupField',
      relatedView: 'users',
      hint: 'User responsible for resolving the case'
    },
    { name: 'product', type: 'LookupField', relatedView: 'crmProducts', hint: 'Product associated with the case' },
    { name: 'comments', type: 'TextField', hint: 'Additional comments or notes on the case' },
    {
      name: 'activities',
      type: 'DataGridField',
      relatedView: 'activities',
      relatedField: 'dataId',
      hint: 'Activities associated with the case'
    }
  ]
};
