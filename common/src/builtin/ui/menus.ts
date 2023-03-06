import { MenuItem } from '../model';

export const messagingMenu: MenuItem = {
  name: 'messaging',
  path: '',
  acl: 'admin',
  icon: 'mdi-send',
  children: [
    {
      name: 'campaigns',
      icon: 'mdi-bullhorn'
    },
    {
      name: 'deliveries',
      icon: 'mdi-send'
    },
    {
      name: 'templates',
      icon: 'mdi-content-copy'
    }
  ]
};

export const adminMenu: MenuItem = {
  name: 'admin',
  label: 'Administration',
  path: '',
  acl: 'admin',
  icon: 'mdi-cog',
  children: [
    {
      name: 'users',
      icon: 'mdi-account'
    },
    {
      name: 'groups',
      icon: 'mdi-account-multiple'
    },
    {
      name: 'acls',
      icon: 'mdi-shield-key'
    },
    {
      name: 'activities',
      icon: 'mdi-text'
    },
    {
      name: 'eventReport',
      icon: 'mdi-chart-bar'
    },
    { name: 'bookmarks', icon: 'mdi-star' }
  ]
};

export const modelMenu: MenuItem = {
  name: 'model',
  label: 'App Designer',
  path: '',
  acl: 'admin',
  icon: 'mdi-hexagon-multiple',
  children: [
    {
      name: 'config',
      icon: 'mdi-tune'
    },
    {
      name: 'navigation',
      icon: 'mdi-navigation'
    },
    {
      name: 'datasources',
      icon: 'mdi-database'
    },
    {
      name: 'views',
      icon: 'mdi-monitor'
    },
    {
      name: 'fields',
      icon: 'mdi-table-edit'
    },
    {
      name: 'validators',
      icon: 'mdi-check'
    },
    {
      name: 'choices',
      icon: 'mdi-form-dropdown'
    },
    {
      name: 'messages',
      icon: 'mdi-translate'
    },
    {
      name: 'webActions',
      icon: 'mdi-web-sync'
    },
    {
      name: 'serverActions',
      icon: 'mdi-cloud-sync'
    }
  ]
};
