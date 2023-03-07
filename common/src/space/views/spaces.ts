import { DataGridViewModel, asSingle, asArray, Group, ListViewModel, FormViewModel, constants } from 'index';

import { ChatRoom } from './chat';
import { File } from './files';

export const spaces: DataGridViewModel = {
  parent: 'spaceBase',
  label: 'Spaces',
  icon: 'mdi-code-brackets',
  labelField: 'name',
  table: 'space_space',
  acl: 'groupRead',
  aclByRecord: true,
  aclField: 'acl',
  ownerField: 'owner',
  groupField: 'group',
  columnFields: ['name', 'spaceType', 'status', 'group', 'createdBy', 'updatedAt'],
  detailView: 'spaceDetail',
  mobileView: 'spaceList',
  defaultData: { storage: 'default', status: 'open' },
  beforeCreate: async ({ data }) => {
    const space = asSingle(data);
    if (space.group) space.id ??= space.group.id;
  },
  afterCreate: async ({ data, registry: { dataService, authService } }) => {
    const space = asSingle(data);
    let group: Group;
    if (!space.group) {
      group = { id: space.id, name: space.name, displayName: space.name, groupType: 'space' };
      await dataService.create({ view: 'groups', data: group });
      await dataService.create({
        view: 'groupMembers',
        data: { group: group.id, member: authService.user.id, role: 'manager' }
      });
      await dataService.update({ view: 'spaces', dataId: space.id, data: { group: group.id } });
    }

    await dataService.create<File>({
      view: 'files',
      data: {
        id: space.id,
        name: space.name,
        isFolder: true,
        space: space.id,
        storage: space.storage,
        folder: 'everything'
      }
    });

    await dataService.create<File>({
      view: 'files',
      data: {
        id: space.id.toString().concat(constants.DEFAULT_SPACE_ATTACHMENT_FOLDER_SUFFIX),
        name: 'Attached Files',
        isFolder: true,
        space: space.id,
        storage: space.storage,
        folder: space.id,
        allowDuplicateFileNames: true,
        isImmutable: true
      }
    });

    await dataService.create<ChatRoom>({
      view: 'chatRooms',
      data: { id: space.id, name: space.name, space: space.id, group: space.id }
    });
  },
  beforeRemove: async ({ dataId, registry: { dataService } }) => {
    for (const spaceId of asArray(dataId)) {
      await dataService.remove({ view: 'files', filter: { space: dataId }, skipNoRecord: true });
      await dataService.remove({ view: 'chatRooms', filter: { space: dataId }, skipNoRecord: true });
      await dataService.remove({ view: 'groups', dataId: spaceId, filter: { groupType: 'space' }, skipNoRecord: true });
    }
  },
  fields: [
    { name: 'name', label: 'Name', type: 'StringField', cols: 12, required: true },
    { name: 'description', label: 'Description', type: 'RichTextField', height: '350px', cols: 12 },
    {
      name: 'spaceType',
      label: 'Space Type',
      type: 'ChoiceField',
      choice: 'spaceType',
      cols: 12,
      required: true,
      defaultValue: 'private'
    },
    { name: 'acl', type: 'LookupField', relatedView: 'acls', hidden: true },
    {
      name: 'status',
      label: 'Status',
      type: 'ChoiceField',
      choice: 'spaceStatus',
      required: true,
      defaultValue: 'open'
    },
    { name: 'group', label: 'Group', type: 'LookupField', relatedView: 'groups', actions: ['openLookupEdit'] },
    {
      name: 'picture',
      label: 'Picture',
      type: 'ImageEditorField',
      emptyImage: '/static/user.png',
      cols: 12,
      height: '160px',
      crop: 'Circle',
      saveWidth: 160
    },
    { name: 'owner', type: 'LookupField', relatedView: 'principals', notNull: true },
    { name: 'storage', label: 'Storage', type: 'LookupField', relatedView: 'storages', notNull: true }
  ],
  webActions: [
    {
      name: 'openMySpace',
      actionType: 'single',
      execute: async ({ selectedId, registry: { uiService } }) => {
        await uiService.openRoute({ view: '/mySpaces', dataId: selectedId });
      }
    },
    {
      name: 'shareMySpace',
      actionType: 'single',
      icon: 'mdi-share',
      execute: async ({ selectedId }) => {
        try {
          await navigator.share({
            title: `Share Space Link`,
            url: `${window.location.origin}/#/mySpaces/${selectedId}`
          });
        } catch {}
      }
    }
  ]
};

export const spaceList: ListViewModel = {
  type: 'ListView',
  parent: 'spaces',
  itemClickAction: 'openMySpace',
  viewActions: ['addSpace', 'refresh'],
  hideActionLabel: true,
  newView: {
    label: 'New Space',
    type: 'FormView',
    formFields: ['name', 'picture', 'spaceType'],
    parent: 'spaces',
    viewActions: ['submitForm']
  },
  webActions: [
    {
      name: 'addSpace',
      label: 'Add Space',
      icon: 'mdi-archive-plus-outline',
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
          viewService.refresh();
        }
      }
    }
  ],
  filter: { filters: [{ field: 'id', operator: 'ne', value: 'everything' }] },
  listSections: [
    {
      side: true,
      avatar: true,
      listFields: ['picture']
    },
    {
      listFields: ['name']
    },
    {
      side: true,
      listFields: ['actions']
    }
  ],
  fields: [{ name: 'actions', type: 'ActionField', actions: ['openEdit', 'shareMySpace'] }]
};

export const spaceDetail: FormViewModel = {
  type: 'FormView',
  label: 'Space',
  icon: 'mdi-code-brackets',
  formFields: ['name', 'picture', 'spaceType'],
  parent: 'spaces',
  viewActions: ['submitForm', 'openRemove']
};
