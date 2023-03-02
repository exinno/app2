import { adminMenu, messagingMenu, modelMenu, NavigationModel } from 'app2-common';

const navigationModel: NavigationModel = {
  indexRedirect: '/home',

  listMenuItems: [{ name: 'home', icon: 'mdi-home' }, messagingMenu, adminMenu, modelMenu],

  tabMenuItems: [{ name: 'home', icon: 'mdi-home' }],

  tabMenuScreenLt: 'md'
};

export default navigationModel;
