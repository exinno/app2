import { NavigationModel, messagingMenu, adminMenu, modelMenu } from 'app2-common';

const navigationModel: NavigationModel = {
  indexRedirect: '/home',
  listMenuItems: [
    { name: 'home', icon: 'mdi-home' },
    {
      label: 'Bookmarks',
      icon: 'mdi-star',
      path: '',
      acl: 'authenticated',
      children: ({ registry: { bookmarkService } }) => bookmarkService.bookmarks
    },
    { name: 'product', icon: 'mdi-checkbox-blank-badge' },
    { name: 'pricing', icon: 'mdi-brightness-percent' },
    { name: 'docs', icon: 'mdi-text-box-multiple' },
    { name: 'apps', label: 'My apps', icon: 'mdi-apps', acl: 'authenticated' },
    { name: 'appTemplates', icon: 'mdi-content-copy' },
    messagingMenu,
    adminMenu,
    modelMenu
  ],
  listMenuActions: ['viewInNewTab']
};

export default navigationModel;
