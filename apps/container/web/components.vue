<script lang="ts">
import { registry } from 'app2-common';

const { uiService } = registry;

uiService.registerComponents('View', {
  home: () => import('./views/home.vue'),
  product: () => import('./views/product.vue'),
  pricing: () => import('./views/pricing.vue')
});

export default {};
</script>
