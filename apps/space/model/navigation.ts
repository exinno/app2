import { MenuItem, NavigationModel, adminMenu } from 'app2-common';
import { crmMenuItems } from '../../crm/model/navigation';

export const spaceMenu: MenuItem[] = [
  {
    label: 'Bookmarks',
    icon: 'mdi-star',
    path: '',
    acl: 'authenticated',
    children: ({ registry: { bookmarkService } }) => bookmarkService.bookmarks
  },
  {
    name: 'mySpaces',
    label: 'My Spaces',
    icon: 'mdi-code-brackets',
    acl: 'authenticated',
    path: '',
    children: ({ registry: { appCtx } }) => appCtx.mySpacesMenu
  },
  {
    name: 'spaceManager',
    path: '',
    icon: 'mdi-office-building-cog',
    acl: 'admin',
    children: [
      { name: 'spaces', icon: 'mdi-code-brackets' },
      { name: 'tasks', icon: 'mdi-ticket' },
      { name: 'posts', icon: 'mdi-tag' }
    ]
  },
  {
    name: 'crm',
    label: 'CRM',
    path: '',
    icon: 'mdi-face-agent',
    acl: 'authenticated',
    children: crmMenuItems
  },
  adminMenu
];

const navigationModel: NavigationModel = {
  indexRedirect: '/spaces',
  listMenuItems: spaceMenu,
  listMenuActions: ['viewInNewTab']
};

export default navigationModel;
