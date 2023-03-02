import { DataGridViewModel } from 'app2-common';

export const crmInvoices: DataGridViewModel = {
  type: 'DataGridView',
  hint: 'A document that lists the crmProducts, quantities, and agreed prices for crmProducts or services that a customer has ordered.',
  parent: 'crmBase',
  label: 'Invoices',
  table: 'crm_invoices',
  labelField: 'invoiceNo',
  fields: [
    {
      name: 'invoiceNo',
      label: 'Invoice No.',
      type: 'StringField',
      hint: 'Unique identifier for the invoice',
      required: true
    },
    { name: 'account', type: 'LookupField', relatedView: 'crmAccounts' },
    { name: 'contact', type: 'LookupField', relatedView: 'crmContacts' },
    { name: 'order', type: 'LookupField', relatedView: 'crmOrders' },
    { name: 'issueDate', label: 'Issue Date', type: 'DateField', hint: 'The date the invoice was issued' },
    { name: 'dueDate', label: 'Due Date', type: 'DateField', hint: 'The date the invoice is due to be paid' },
    {
      name: 'status',
      label: 'Status',
      type: 'SelectField',
      optionItems: ['draft', 'sent', 'paid', 'cancelled'],
      hint: 'The current status of the invoice'
    },
    { name: 'total', label: 'Total', type: 'NumberField', hint: 'The total amount due for the invoice' },
    {
      name: 'items',
      type: 'DataGridField',
      relatedView: 'invoiceItems',
      relatedField: 'invoice',
      hint: 'Items included in the invoice'
    }
  ]
};

export const invoiceItems: DataGridViewModel = {
  type: 'DataGridView',
  hint: 'Individual crmProducts or services that are included in an invoice',
  parent: 'editable',
  label: 'invoice items',
  table: 'crm_invoice_items',
  fields: [
    { name: 'product', type: 'LookupField', relatedView: 'crmProducts' },
    { name: 'description', label: 'Description', type: 'TextField', hint: 'Detailed description of the item' },
    { name: 'quantity', label: 'Quantity', type: 'NumberField', hint: 'Number of units of the item' },
    { name: 'price', label: 'Price', type: 'CurrencyField', hint: 'Price of the item', currency: 'USD' },
    { name: 'discount', label: 'Discount', type: 'NumberField', hint: 'Discount amount or percentage' },
    {
      name: 'total',
      label: 'Total',
      type: 'CurrencyField',
      hint: 'Total cost of the item after discount',
      currency: 'USD'
    },
    { name: 'invoice', type: 'LookupField', relatedView: 'crmInvoices' }
  ]
};
