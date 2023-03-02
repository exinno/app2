import { DataGridViewModel } from 'app2-common';

export const crmOrders: DataGridViewModel = {
  type: 'DataGridView',
  hint: 'A record of a customer purchasing a product or service',
  parent: 'crmBase',
  label: 'Orders',
  table: 'crm_orders',
  labelField: 'order_no',
  fields: [
    {
      name: 'order_no',
      label: 'Order No',
      type: 'StringField',
      hint: 'Unique identifier for the order',
      required: true
    },
    { name: 'account', type: 'LookupField', relatedView: 'crmAccounts' },
    { name: 'contact', type: 'LookupField', relatedView: 'crmContacts' },
    { name: 'quote', type: 'LookupField', relatedView: 'crmQuotes' },
    {
      name: 'status',
      label: 'Status',
      type: 'SelectField',
      optionItems: ['draft', 'submitted', 'approved', 'shipped', 'cancelled'],
      hint: 'Current stage or status of the order'
    },
    { name: 'order_date', label: 'Order Date', type: 'DateField', hint: 'Date the order was placed' },
    { name: 'ship_date', label: 'Ship Date', type: 'DateField', hint: 'Date the order is expected to ship' },
    { name: 'total', label: 'Total', type: 'CurrencyField', hint: 'Total cost of the order', currency: 'USD' },
    {
      name: 'items',
      type: 'DataGridField',
      relatedView: 'crmOrderItems',
      relatedField: 'order',
      hint: 'Products and services included in the order'
    },
    {
      name: 'activities',
      type: 'DataGridField',
      relatedView: 'activities',
      relatedField: 'dataId',
      hint: 'Activities associated with the order'
    },
    {
      name: 'crmCases',
      type: 'DataGridField',
      relatedView: 'crmCases',
      relatedField: 'order',
      hint: 'Cases associated with the order'
    }
  ]
};

export const crmOrderItems: DataGridViewModel = {
  type: 'DataGridView',
  hint: 'A record of a product or service included in an order',
  parent: 'editable',
  table: 'crm_order_items',
  fields: [
    { name: 'product', type: 'LookupField', relatedView: 'crmProducts' },
    { name: 'quantity', label: 'Quantity', type: 'NumberField', hint: 'Number of units of the product or service' },
    {
      name: 'price',
      label: 'Price',
      type: 'CurrencyField',
      hint: 'Unit price of the product or service',
      currency: 'USD'
    },
    {
      name: 'total',
      label: 'Total',
      type: 'CurrencyField',
      hint: 'Total cost of the product or service in the order',
      currency: 'USD'
    }
  ]
};
