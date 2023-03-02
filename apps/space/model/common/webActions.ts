import { WebActionModel } from 'app2-common';

const list: Array<WebActionModel> = [
  {
    name: 'openSpaceRight',
    label: 'Space on Right',
    icon: 'mdi-dock-right',
    ellipsis: false,
    execute: ({ registry: { uiService, navigationService }, value }) => {
      const viewRoute = navigationService.getRouteParams(value);
      if (uiService.openedRightView) uiService.close(uiService.openedRightView);

      void uiService.openRightView({
        view: viewRoute.view,
        pageCtx: { spaceId: viewRoute.dataId }
      });
    }
  }
];

export default list;
