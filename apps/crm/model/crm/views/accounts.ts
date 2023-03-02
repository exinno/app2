import { DataGridViewModel } from 'app2-common';

export const crmAccounts: DataGridViewModel = {
  type: 'DataGridView',
  hint: 'Organizations or companies that a business deals with, such as customers or vendors',
  parent: 'crmBase',
  label: 'Accounts',
  table: 'crm_accounts',
  labelField: 'name',
  fields: [
    { name: 'name', label: 'Name', type: 'StringField', hint: 'Name of the account', required: true },
    { name: 'industry', label: 'Industry', type: 'StringField', hint: 'Industry the account belongs to' },
    { name: 'type', label: 'Type', type: 'StringField', hint: 'Enter the type of company' },
    { name: 'address', label: 'Address', type: 'StringField', hint: 'Enter the address of the company' },
    {
      name: 'phone',
      label: 'Phone',
      type: 'StringField',
      validators: ['phoneNumber'],
      hint: 'Enter the phone number in the format xxx-xxxx-xxxx'
    },
    { name: 'email', label: 'Email', type: 'StringField', validators: ['email'], hint: 'Enter a valid email address' },
    { name: 'website', label: 'Website', type: 'StringField', validators: ['url'], hint: 'Enter the website URL' },
    {
      name: 'annualRevenue',
      label: 'Annual Revenue',
      type: 'NumberField',
      hint: 'Enter the annual revenue in numbers'
    },
    { name: 'numEmployees', label: 'Number of Employees', type: 'NumberField', hint: 'Enter the number of employees' },
    {
      name: 'crmContacts',
      type: 'DataGridField',
      relatedView: 'crmContacts',
      relatedField: 'account',
      hint: 'Contacts associated with the account'
    },
    {
      name: 'crmCases',
      type: 'DataGridField',
      relatedView: 'crmCases',
      relatedField: 'account',
      hint: 'Cases associated with the account'
    },
    { name: 'crmQuotes', type: 'DataGridField', relatedView: 'crmQuotes', relatedField: 'account' },
    { name: 'crmOrders', type: 'DataGridField', relatedView: 'crmOrders', relatedField: 'account' },
    { name: 'crmInvoices', type: 'DataGridField', relatedView: 'crmInvoices', relatedField: 'account' },
    { name: 'crmLeads', type: 'DataGridField', relatedView: 'crmLeads', relatedField: 'account' },
    {
      name: 'activities',
      type: 'DataGridField',
      relatedView: 'activities',
      relatedField: 'dataId',
      hint: 'Activities associated with the account'
    }
  ]
};
