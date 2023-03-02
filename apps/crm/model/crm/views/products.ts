import { DataGridViewModel } from 'app2-common';

export const crmProducts: DataGridViewModel = {
  type: 'DataGridView',
  hint: 'Items or goods that are sold by the business',
  parent: 'crmBase',
  label: 'Products',
  table: 'crm_products',
  labelField: 'name',
  fields: [
    { name: 'name', label: 'Name', type: 'StringField', hint: 'Name of the product', required: true, cols: 12 },
    { name: 'description', label: 'Description', type: 'TextField', hint: 'Description of the product' },
    { name: 'category', type: 'LookupField', relatedView: 'productCategories' },
    { name: 'price', label: 'Price', type: 'NumberField', hint: 'Price of the product' },
    { name: 'quantity', label: 'Quantity', type: 'NumberField', hint: 'Available quantity of the product' },
    { name: 'image', label: 'Image', type: 'ImageField', hint: 'Image of the product' },
    {
      name: 'crmOpportunities',
      type: 'DataGridField',
      relatedView: 'crmOpportunities',
      relatedField: 'product',
      hint: 'Opportunities associated with the product'
    },
    {
      name: 'crmQuotes',
      type: 'DataGridField',
      relatedView: 'crmQuotes',
      relatedField: 'product',
      hint: 'Quotes associated with the product'
    },
    {
      name: 'crmOrders',
      type: 'DataGridField',
      relatedView: 'crmOrders',
      relatedField: 'product',
      hint: 'Orders associated with the product'
    },
    {
      name: 'crmInvoices',
      type: 'DataGridField',
      relatedView: 'crmInvoices',
      relatedField: 'product',
      hint: 'Invoices associated with the product'
    }
  ]
};

export const productCategories: DataGridViewModel = {
  type: 'DataGridView',
  hint: 'Classification of crmProducts',
  parent: 'editable',
  label: 'Product Categories',
  table: 'crm_product_categories',
  labelField: 'name',
  fields: [
    { name: 'name', label: 'Category Name', type: 'StringField', required: true },
    { name: 'description', label: 'Description', type: 'StringField' },
    { name: 'crmProducts', type: 'DataGridField', relatedView: 'crmProducts', relatedField: 'category' }
  ]
};
