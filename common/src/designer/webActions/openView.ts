import { DataWebActionModel, LookupFieldModel } from '../..';

export const openAdd: DataWebActionModel = {
  label: 'Add',
  icon: 'mdi-plus',
  actionType: 'overall',
  permission: 'create',
  execute: async ({ viewModel, registry: { uiService, modelService, common }, viewService, pageCtx }) => {
    let data: any;
    const filter = modelService.callProp(viewModel, 'filter', { viewService });
    if (filter) data = common.filterToDict(filter);

    const newData = await uiService.openDetail({
      view: viewModel,
      parentView: viewService,
      pageCtx,
      dataId: '$new',
      data
    });
    if (newData) {
      if (!modelService.getServerView(viewModel)) viewService.data.push(newData);
      if (!viewModel.live) viewService.refresh();
    }
  }
};

export const openEdit: DataWebActionModel = {
  label: 'Edit',
  icon: 'mdi-pencil',
  actionType: 'single',
  permission: 'update',
  execute: async ({
    viewModel,
    registry: { uiService, modelService, common },
    selectedData,
    selectedId,
    pageCtx,
    viewService
  }) => {
    const detailData = await uiService.openDetail({
      view: viewModel,
      parentView: viewService,
      data: selectedData,
      dataId: selectedId,
      pageCtx
    });
    if (detailData) {
      if (!modelService.getServerView(viewModel)) common.replaceObject(selectedData, detailData);
      if (!viewModel.live) viewService.refresh();
    }
  }
};

export const openView: DataWebActionModel = {
  name: 'openView',
  label: 'Detail',
  icon: 'mdi-file-document',
  actionType: 'single',
  permission: 'get',
  execute: async ({ viewModel, registry: { uiService }, data, viewService, selectedId }) => {
    await uiService.openDetail({
      view: { ...viewModel, readonly: true },
      parentView: viewService,
      data,
      dataId: selectedId
    });
  }
};

export const openRemove: DataWebActionModel = {
  name: 'openRemove',
  label: 'Remove',
  icon: 'mdi-close',
  actionType: 'multiple',
  permission: 'remove',
  ellipsis: true,
  execute: async ({
    viewModel,
    registry: { dataService, uiService, modelService, _ },
    data,
    selectedData,
    viewService
  }) => {
    const confirmed = await uiService.confirm({
      message: 'Are you sure remove the selected items?',
      icon: 'mdi-close'
    });
    if (confirmed) {
      if (modelService.getServerView(viewModel)) {
        await dataService.remove({
          view: viewModel.name || viewModel.parent,
          dataId: viewModel.keyField ? selectedData.map((row) => row[viewModel.keyField]) : selectedData
        });

        if (!viewModel.live) viewService.refresh();
      } else {
        const allData: any[] = viewService.data;
        for (const selectedRow of selectedData)
          _.remove(allData, (item) =>
            viewModel.keyField ? item[viewModel.keyField] == selectedRow[viewModel.keyField] : item == selectedRow
          );
        viewService.refresh();
      }
      if (selectedData.length == 1 && data == selectedData[0]) {
        // Form에서 실행한 경우 경우 닫아주기
        uiService.close();
        if (!viewModel.live) viewService.parentView.refresh();
      }
    }
  }
};

export const openLookupAdd: DataWebActionModel = {
  name: 'openLookupAdd',
  label: 'Add',
  icon: 'mdi-plus',
  actionType: 'overall',
  permission: 'create',
  execute: async ({ fieldModel, data, registry: { uiService }, viewService, pageCtx }) => {
    const newData = await uiService.openDetail({
      view: (fieldModel as LookupFieldModel).relatedView,
      parentView: viewService,
      pageCtx,
      dataId: '$new'
    });

    if (newData) data[fieldModel.name] = newData;
  }
};

export const openLookupEdit: DataWebActionModel = {
  name: 'openLookupEdit',
  label: 'Edit',
  icon: 'mdi-pencil',
  actionType: 'overall',
  permission: 'create',
  execute: async ({ fieldModel, data, value, registry: { uiService }, viewService, pageCtx }) => {
    const detailData = await uiService.openDetail({
      view: (fieldModel as LookupFieldModel).relatedView,
      parentView: viewService,
      dataId: value.$id ?? value,
      pageCtx
    });

    if (detailData) data[fieldModel.name] = detailData;
  },
  hidden: ({ value }) => !value
};

export const openActivities: DataWebActionModel = {
  name: 'openActivities',
  label: 'Activities',
  icon: 'mdi-history',
  actionType: 'overall',
  permission: 'manage',
  ellipsis: true,
  execute: async ({ registry: { uiService }, viewService }) => {
    await uiService.openModal({
      view: {
        parent: 'activities',
        width: '1000px'
      },
      parentView: viewService
    });
  }
};

export const openShareView: DataWebActionModel = {
  label: 'Share View',
  icon: 'mdi-security',
  actionType: 'overall',
  permission: 'manage',
  ellipsis: true,
  execute: async ({ registry: { uiService }, viewModel, viewService }) => {
    // const acl = viewModel.acl ?? modelService.config.defaultAcl;
    // const aces = await dataService.getAll({ view: 'aces', filter: { field: 'acl', value: acl } });
    const objectType = 'views';
    const objectId = viewModel.name;
    const name = objectType + '$' + objectId;
    const aclData = { name, objectType, objectId, aces: [] };
    const result = await uiService.openDetail({
      view: { parent: 'acls', label: 'Share' },
      parentView: viewService,
      data: aclData
    });

    if (result) viewModel.$loadedTime = new Date().getTime(); // for refresh ViewActions
  }
};

export const openPermission: DataWebActionModel = {
  name: 'openPermission',
  label: 'Permission',
  icon: 'mdi-shield-key',
  actionType: 'single',
  execute: async ({
    registry: { uiService, modelService, dataService, common },
    viewModel,
    viewService,
    selectedData,
    selectedId
  }) => {
    const objectType = modelService.getServerView(viewModel);
    const objectId = selectedId ?? selectedData[viewModel.keyField] ?? selectedData.$id;
    const name = objectType + '$' + objectId;

    const permissionView = modelService.getView('permission');
    let aclData = await dataService.get({
      view: 'acls',
      dataId: name,
      select: modelService
        .getFields(permissionView, 'formFields')
        .filter(common.isSelectableField)
        .map((field) => field.name)
    });
    const dataId = aclData?.$id;
    if (!aclData) aclData = { name, objectType, objectId, aces: [] };
    const result = await uiService.openModal({
      openType: 'modal',
      view: 'permission',
      parentView: viewService,
      pageCtx: { objectLabel: selectedData[viewModel.labelField] ?? selectedData.$id },
      data: aclData,
      dataId
    });

    if (result) viewService.refresh();
  },
  hidden: ({ viewModel, viewService }) => !viewModel.aclByRecord || viewService.isNew
};

export const openComments: DataWebActionModel = {
  name: 'openComments',
  label: 'Comments',
  icon: 'mdi-forum',
  badgeValue: ({ selectedData }) => selectedData?.commentCount,
  execute: async ({ registry: { uiService, modelService, common }, viewModel, viewService, selectedId }) => {
    await uiService.openPanel({
      view: { type: 'CommentView', parent: 'comments', dataView: modelService.getServerView(viewModel) },
      parentView: viewService,
      dataId: common.asSingle(selectedId)
    });
  }
};
