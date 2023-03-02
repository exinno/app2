import { TabViewModel, TimelineViewModel, GroupMember, DataGridViewModel } from '../../../';

export const mySpaces: TabViewModel = {
  type: 'TabView',
  acl: 'authRead',
  children: ({ pageCtx }) =>
    pageCtx?.spaceId == 'everything'
      ? [
          'spaceList',
          'chatRooms',
          'tasks',
          'treeGrid',
          'files',
          'kanban',
          'calendar',
          'gantt',
          'posts',
          'spaceTimeline'
        ]
      : [
          'chatRooms',
          'tasks',
          'treeGrid',
          'files',
          'kanban',
          'calendar',
          'gantt',
          'posts',
          'spaceTimeline',
          'spaceMembers'
        ],
  openDetailByDataId: false,
  bottomTabs: true,
  hideToolbar: true,
  onRouteChange: ({ route, registry: { router, appCtx }, pageCtx }) => {
    if (route.params.dataId == 'everything') {
      if (!route.params.childView) router.push(`${route.params.dataId}/spaceList`);
    } else {
      appCtx.lastSpaceTab ??= 'chatRooms';
      if (!route.params.childView) {
        router.push(`${route.params.dataId}/${appCtx.lastSpaceTab}`);
      } else {
        appCtx.lastSpaceTab = route.params.childView;
      }
    }
    if (appCtx.lastSpaceTab == 'files' && pageCtx.fileId && !route.params.childDataId) pageCtx.fileId = null;
  },
  hidden: ({ pageCtx }) => !pageCtx.spaceId || !pageCtx.members,
  watches: [
    {
      watch: ({ route }) => route.params.dataId,
      execute: async ({ pageCtx, route }) => {
        if (!route.params.dataId || pageCtx.spaceId == route.params.dataId) return;

        pageCtx.spaceId = route.params.dataId;
      },
      immediate: true
    },
    {
      watch: ({ pageCtx }) => pageCtx.spaceId,
      execute: async ({ pageCtx, registry: { dataService } }) => {
        delete pageCtx.members;

        if (pageCtx.spaceId == 'everything') {
          pageCtx.space = { name: 'Everything', $id: null };
          pageCtx.members = [];
        } else if (pageCtx.spaceId) {
          pageCtx.space = await dataService.get({ view: 'spaces', dataId: pageCtx.spaceId, select: 'name' });
          const members = await dataService.getAll<GroupMember>({
            view: 'groupMembers',
            select: ['role', 'member', 'member.picture'],
            filter: { group: pageCtx.spaceId }
          });
          pageCtx.members = members
            .filter((member) => member.member)
            .map((member) => ({ ...member.member, role: member.role }));
        }
      },
      immediate: true
    }
  ],
  webActions: [
    {
      name: 'loadMySpacesMenu',
      execute: async ({ registry: { dataService, appCtx, navigationService } }) => {
        const menus = await dataService.executeAction({ view: 'mySpaces', action: 'loadMySpacesMenu' });

        appCtx.mySpacesMenu = menus.map((menu) => ({
          ...menu,
          actions: [...navigationService.listMenuActions, 'openSpaceRight']
        }));
      }
    }
  ],
  serverActions: [
    {
      name: 'loadMySpacesMenu',
      execute: async ({ registry: { dataService }, context }) => {
        if (!context.user) return [];

        const myGroups = await dataService.getAll({
          view: 'groupMembers',
          joins: [{ joinType: 'innerJoin', table: 'space_space', name: 'space', on: 'this.group = space.id' }],
          select: ['group'],
          filter: { member: context.user.id }
        });

        const spaceMenus = myGroups.map((groupMember) => ({
          name: groupMember.group.id,
          label: groupMember.group.displayName,
          path: `/mySpaces/${groupMember.group.id}`
        }));

        return [{ name: 'everything', label: 'Everything', path: '/mySpaces/everything' }, ...spaceMenus];
      }
    }
  ]
};

export const spaceTimeline: TimelineViewModel = {
  parent: 'activityTimeline',
  type: 'TimelineView',
  filter: { view: 'spaces' }
};

export const spaceMembers: DataGridViewModel = {
  label: 'Members',
  icon: 'mdi-account-multiple',
  parent: 'groupMembers',
  columnFields: ['member', 'role'],
  viewActions: ({ pageCtx, registry: { authService } }) => {
    for (const row of pageCtx.members) {
      if (row.id == authService.user.id && row.role == 'manager') {
        return ['openAdd', 'openRemove', 'sendInvitation'];
      }
    }
    return ['sendInvitation'];
  },

  detailView: {
    type: 'FormView',
    openType: 'modal',
    formFields: ['member', 'role'],
    viewActions: ['submitForm'],
    width: '600px'
  },

  hasOwnerPermission: ({ pageCtx, user }) => {
    return pageCtx.members?.some((member) => member.id == user.id && member.role == 'manager');
  },
  defaultData: ({ pageCtx, route }) => ({ group: pageCtx.spaceId ?? route.params.dataId }),
  filter: ({ pageCtx, route }) => ({ group: pageCtx.spaceId ?? route.params.dataId }),
  webActions: [
    {
      name: 'sendInvitation',
      icon: 'mdi-email',
      label: 'Send invitation',
      execute: async ({ registry: { uiService }, viewService }) => {
        await uiService.openModal({
          view: 'invitation',
          parentView: viewService
        });
      }
    }
  ]
};
