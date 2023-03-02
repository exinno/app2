import { DataGridViewModel } from 'app2-common';

export const crmOpportunities: DataGridViewModel = {
  type: 'DataGridView',
  hint: 'Potential sales crmOpportunities that have been qualified and are being pursued',
  parent: 'crmBase',
  label: 'Opportunities',
  table: 'crm_opportunities',
  labelField: 'name',
  fields: [
    { name: 'name', label: 'Name', type: 'StringField', hint: 'Name of the opportunity', required: true, cols: 12 },
    { name: 'account', type: 'LookupField', relatedView: 'crmAccounts' },
    { name: 'contact', type: 'LookupField', relatedView: 'crmContacts' },
    { name: 'lead', type: 'LookupField', relatedView: 'crmLeads' },
    { name: 'amount', label: 'Amount', type: 'NumberField', hint: 'Estimated value of the opportunity' },
    { name: 'closeDate', label: 'Close Date', type: 'DateField', hint: 'Expected date of closing the opportunity' },
    {
      name: 'stage',
      label: 'Stage',
      type: 'SelectField',
      optionItems: [
        'prospecting',
        'qualification',
        'needs analysis',
        'value proposition',
        'identify decision makers',
        'perception analysis',
        'proposal/price quote',
        'negotiation/review',
        'closed won',
        'closed lost'
      ],
      hint: 'Current stage of the opportunity in the sales process'
    },
    {
      name: 'activities',
      type: 'DataGridField',
      relatedView: 'activities',
      relatedField: 'dataId',
      hint: 'Activities associated with the opportunity'
    },
    {
      name: 'crmCases',
      type: 'DataGridField',
      relatedView: 'crmCases',
      relatedField: 'opportunity',
      hint: 'Cases associated with the opportunity'
    }
  ]
};
