import { MenuItem, NavigationModel } from 'app2-common';

export const crmMenuItems: MenuItem[] = [
  { name: 'crmAccounts', label: 'Accounts', icon: 'mdi-account-group' },
  { name: 'crmContacts', label: 'Contacts', icon: 'mdi-account-box' },
  { name: 'crmLeads', label: 'Leads', icon: 'mdi-filter' },
  { name: 'crmOpportunities', label: 'Opportunities', icon: 'mdi-bullseye' },
  { name: 'crmCases', label: 'Cases', icon: 'mdi-ticket-account' },
  { name: 'crmCampaigns', label: 'Campaigns', icon: 'mdi-bullhorn' },
  { name: 'crmProducts', label: 'Products', icon: 'mdi-package-variant' },
  { name: 'crmQuotes', label: 'Quotes', icon: 'mdi-file-document' },
  { name: 'crmOrders', label: 'Orders', icon: 'mdi-cart-arrow-right' },
  { name: 'crmInvoices', label: 'Invoices', icon: 'mdi-currency-usd' }
];

const navigationModel: NavigationModel = {
  indexRedirect: '/crmAccounts',
  listMenuItems: crmMenuItems,
  listMenuActions: ['viewInNewTab']
};

export default navigationModel;
