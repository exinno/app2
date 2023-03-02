import { registry } from 'app2-common';

const { uiService } = registry;

uiService.registerComponents('View', {
  home: import('./views/home.vue')
});
