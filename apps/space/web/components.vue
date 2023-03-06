<script lang="ts">
import { registry } from 'app2-common';

const { uiService } = registry;

uiService.registerComponents('View', {
  home: () => import('./views/home.vue'),
  UploadProgress: () => import('./views/UploadProgress.vue')
});

export default {};
</script>
