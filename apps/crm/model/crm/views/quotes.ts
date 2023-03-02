import { DataGridViewModel } from 'app2-common';

export const crmQuotes: DataGridViewModel = {
  type: 'DataGridView',
  hint: 'Proposals or estimates for potential sales',
  parent: 'crmBase',
  label: 'Quotes',
  table: 'crm_quotes',
  labelField: 'name',
  fields: [
    { name: 'name', label: 'Name', type: 'StringField', hint: 'Name of the quote', required: true, cols: 12 },
    {
      name: 'quoteNo',
      label: 'Quote No',
      type: 'StringField',
      hint: 'Unique identifier for the quote'
    },
    { name: 'account', type: 'LookupField', relatedView: 'crmAccounts' },
    { name: 'contact', type: 'LookupField', relatedView: 'crmContacts' },
    { name: 'description', label: 'Description', type: 'TextField', hint: 'Description of the quote' },
    { name: 'validity', label: 'Validity', type: 'DateField', hint: 'The date until which the quote is valid' },
    { name: 'total', label: 'Total', type: 'CurrencyField', hint: 'The total amount of the quote', currency: 'USD' },
    {
      name: 'items',
      type: 'DataGridField',
      relatedView: 'quoteItems',
      relatedField: 'quote',
      hint: 'Items included in the quote'
    },
    {
      name: 'status',
      label: 'Status',
      type: 'SelectField',
      optionItems: ['draft', 'sent', 'accepted', 'declined'],
      hint: 'The current status of the quote'
    },
    {
      name: 'crmCases',
      type: 'DataGridField',
      relatedView: 'crmCases',
      relatedField: 'quote',
      hint: 'Cases associated with the quote'
    }
  ]
};

export const quoteItems: DataGridViewModel = {
  type: 'DataGridView',
  hint: 'Individual items included in a quote',
  parent: 'editable',
  label: 'quoteItems',
  table: 'crm_quote_items',
  fields: [
    { name: 'name', label: 'Name', type: 'StringField', hint: 'The name of the item' },
    { name: 'description', label: 'Description', type: 'TextField', hint: 'A detailed description of the item' },
    { name: 'quantity', label: 'Quantity', type: 'NumberField', hint: 'The number of items included' },
    { name: 'price', label: 'Price', type: 'CurrencyField', hint: 'The price per unit of the item', currency: 'USD' },
    { name: 'total', label: 'Total', type: 'CurrencyField', hint: 'The total cost of the item', currency: 'USD' },
    { name: 'product', type: 'LookupField', relatedView: 'crmProducts' },
    { name: 'quote', type: 'LookupField', relatedView: 'crmQuotes' }
  ]
};
