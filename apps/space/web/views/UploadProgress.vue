<template>
  <q-card style="width: 350px; max-height: 300px">
    <q-card-section class="row items-center no-wrap">
      <div>
        <div class="text-weight-bold">
          {{ `Uploaded Files (${service.uploadedFilesLength} / ${modelValue.length})` }}
        </div>
      </div>
      <q-space />
      <q-btn
        flat
        round
        :icon="service.expanded ? 'keyboard_arrow_down' : 'keyboard_arrow_up'"
        @click="service.expanded = !service.expanded"
      />
      <q-btn flat round icon="close" @click="service.close" />
    </q-card-section>

    <q-slide-transition>
      <div v-show="service.expanded">
        <q-separator />
        <q-list separator>
          <q-item v-for="uploadingFile in modelValue">
            <q-item-section avatar>
              <q-icon :name="storageClient.getIcon(uploadingFile)" />
            </q-item-section>

            <q-item-section class="ellipsis">
              <q-item-label>{{ uploadingFile.name }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-circular-progress show-value :value="uploadingFile.progressValue" size="40px">
                {{ uploadingFile.status === 'fail' ? 'fail' : `${uploadingFile.progressValue}%` }}
              </q-circular-progress>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-slide-transition>
  </q-card>
</template>

<script setup lang="ts">
import { registry } from 'app2-common';
const { storageClient, createService, uiService } = registry;

const props = defineProps<{
  modelValue: typeof storageClient['uploadingFiles'];
}>();

const emits = defineEmits<{
  (event: 'close'): void;
}>();

const service = createService(
  class {
    expanded = true;

    get uploadedFilesLength() {
      return props.modelValue.filter((file) => file.status === 'done').length;
    }

    close() {
      emits('close');
      storageClient.refresh();
    }
  }
);
</script>
