import { AttachmentViewModel, AttachmentViewService, WebActionModel } from '../../..';

export const attach: WebActionModel<AttachmentViewService, AttachmentViewModel> = {
  label: 'Attach',
  icon: 'mdi-paperclip',
  children: ['selectAttach', 'uploadLocalFile', 'attachFromCamera']
};
export const uploadLocalFile: WebActionModel<AttachmentViewService, AttachmentViewModel> = {
  label: 'Upload file',
  icon: 'mdi-cellphone-link',
  execute: async ({ registry: { storageClient }, viewService }) => {
    await storageClient.uploadLocalFileAttach(viewService);
  }
};
export const selectAttach: WebActionModel<AttachmentViewService, AttachmentViewModel> = {
  label: ({ viewModel }) => {
    return `Attach from ${viewModel.serverView}`;
  },
  icon: 'mdi-cloud-check-outline',
  execute: async ({ registry: { storageClient }, viewService }) => {
    await storageClient.openAttachAnyView(viewService);
  }
};
export const attachFromCamera: WebActionModel<AttachmentViewService, AttachmentViewModel> = {
  label: 'Take Photo',
  icon: 'mdi-camera',
  execute: async ({ registry: { storageClient }, viewService }) => {
    await storageClient.openCameraAttach(viewService);
  }
};

export const removeAttachedItem: WebActionModel<AttachmentViewService, AttachmentViewModel> = {
  label: 'Delete',
  icon: 'mdi-close',
  execute: async ({ data, registry: { dataService, _ }, pageCtx, viewService }) => {
    const attachedId = data.id;
    const attachField = pageCtx.attachField;
    const dataId = pageCtx.dataId;
    const dataView = pageCtx.dataView;

    await dataService.remove({
      view: 'attachments',
      filter: { dataId, attachedId, attachField, dataView }
    });
    _.remove(viewService.data, (item: any) => item.$id == attachedId);
    _.remove(viewService.dataId, (item: any) => item == attachedId);
  }
};
