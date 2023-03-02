import { View, Field, Owned, asSingle, OccamError, PageCtx } from '../../../';
import _ from 'lodash';

@View({
  type: 'DataGridView',
  name: 'files',
  label: ({ pageCtx }) => pageCtx?.folder?.name ?? 'Drive',
  subLabel: ({ pageCtx }) => pageCtx.space?.name,
  icon: 'mdi-cloud',
  table: 'OcFile',
  parent: 'owned',
  acl: 'groupRead',
  groupField: 'space',
  ownerField: 'owner',
  labelField: 'name',
  orderBy: [
    { field: 'isFolder', direction: 'desc' },
    { field: 'updatedAt', direction: 'desc' }
  ],
  includeSelect: ['contentType', 'isFolder'],
  columnFields: ['icon', 'name', 'contentSize', 'owner', 'updatedAt', 'updatedBy', 'createdAt', 'createdBy'],
  detailView: {
    type: 'FormView',
    formFields: ['name', 'contentSize', 'owner', 'updatedAt', 'updatedBy', 'createdAt', 'createdBy'],
    label: ({ data }) => (data?.name ? `${data.name} Properties` : 'New Folder'),
    onDataIdChange: null,
    onMounted: null
  },
  mobileView: 'fileList',
  pageFields: ['breadcrumb'],
  filterFields: ['folder'],
  droppable: true,
  lazyLoading: true,
  openDetailByDataId: false,
  methods: {
    setFileId(fileId: string, pageCtx: PageCtx, isPage: boolean) {
      const router = $registry.router;
      if (!isPage) {
        pageCtx.fileId = fileId;
      } else {
        const dataId = router.currentRoute.value.params.childDataId;
        if (dataId) router.push('./' + fileId);
        else router.push('./files/' + fileId);
      }
    }
  },
  watches: [
    {
      watch: ({ pageCtx }) => pageCtx.fileId,
      execute: async ({ viewModel, pageCtx, viewService, registry: { storageClient, uiService } }) => {
        const fileId = pageCtx.fileId;
        if (!fileId) return;
        const file = await storageClient.getFile(fileId);
        const viewComponent = storageClient.getViewComponent(file);
        viewModel.methods.setFileId(fileId, pageCtx, viewService.isPage);
        if (file.isFolder && pageCtx?.folder?.id != file.id) {
          if (pageCtx.embedded) {
            await uiService.openModal({
              view: 'files',
              openSize: 'full',
              dataId: file.id
            });
          } else {
            pageCtx.folder = file;
            viewService.refresh();
          }
        } else if (viewComponent) {
          await storageClient.openView(file, viewService);
          if (viewService.serverView == 'files')
            viewModel.methods.setFileId(file.folder.id, pageCtx, viewService.isPage);
        } else if (file.contentSize) {
          storageClient.download(fileId);
        }
      }
    }
  ],
  onMounted: (props) => {
    const { model, dataId, pageCtx, viewService } = props;
    if (!dataId) model.methods.setFileId(pageCtx.spaceId, pageCtx, viewService.isPage);
  },
  onDataIdChange: async ({ dataId, pageCtx }) => {
    if (dataId) pageCtx.fileId = dataId;
  },
  onUnmounted: ({ pageCtx }) => {
    delete pageCtx.folder;
  },
  onDrop: async ({ value, pageCtx, viewService, registry: { storageClient } }) => {
    await storageClient.upload(pageCtx.folder, value.dataTransfer.files, viewService);
  },
  afterGet: async ({ params: pageCtx, result, registry: { dataService } }) => {
    if (pageCtx?.ancestors && result) {
      result.ancestors = [{ id: result.id, name: result.name }];
      let folder = result.folder;
      while (folder?.id) {
        result.ancestors.push({ id: folder.id, name: folder.name });
        const folderData = await dataService.get({ view: 'files', dataId: folder.id, select: 'folder' });
        folder = folderData.folder;
      }
      result.ancestors = result.ancestors.reverse();
    }
  },
  beforeCreate: async ({ data, registry: { dataService } }) => {
    const file: File = asSingle(data);
    if (file.space && file.space == file.id) return; // When creating root folder

    if (!file.folder) throw new Error('There is no upper folder.');

    const folder = await dataService.get<File>({
      view: 'files',
      select: ['space', 'allowDuplicateFileNames'],
      dataId: file.folder
    });
    const allowDuplicates: boolean = folder && folder.allowDuplicateFileNames;

    if (file.isFolder || !allowDuplicates) {
      if (await dataService.get({ view: 'files', select: 'id', filter: _.pick(file, 'folder', 'name') })) {
        throw new OccamError(`There is a file of the same name(${file.name}) in this folder.`);
      }
    }

    if (!folder) throw new OccamError(`There is no folder. ${file.folder}`);
    if (folder.id == 'everything') throw new OccamError(`You cannot create a folder in everything.`);
    const space = await dataService.get({ view: 'spaces', select: 'storage', dataId: folder.space });

    file.space = space;
    file.storage ??= space.storage;
  },
  beforeRemove: async ({ dataId, filter, registry: { dataService, storageService } }) => {
    if (dataId) {
      await storageService.removeFile(dataId);
    } else if (filter) {
      const files = await dataService.getAll({ view: 'files', select: 'id', filter });
      for (const file of files) await storageService.removeFile(file.id);
    }
  },
  itemDbClickAction: 'openFile',
  viewActions: [
    'bookmarkView',
    'openParent',
    '--',
    'addFile',
    'downloadFile',
    'openProperty',
    'openPermission',
    'openRemove',
    'openQueryBuilder',
    'saveViewAs',
    'saveView',
    'refresh'
  ],
  hideActionLabel: true,
  webActions: [
    {
      name: 'openProperty',
      parent: 'openEdit',
      label: 'Properties',
      icon: 'mdi-information'
    },
    {
      name: 'downloadFile',
      label: 'Download',
      icon: 'mdi-download-outline',
      actionType: 'single',
      execute: ({ selectedId, registry: { storageClient } }) => {
        if (Array.isArray(selectedId)) {
          for (const row of selectedId) {
            storageClient.download(row);
          }
        } else {
          storageClient.download(selectedId as string);
        }
      }
    },
    {
      name: 'uploadFile',
      label: 'Upload Files',
      icon: 'mdi-upload-outline',
      actionType: 'overall',
      execute: ({ pageCtx, registry: { storageClient }, viewService }) => {
        void storageClient.openUpload(pageCtx.folder, viewService);
      }
    },
    {
      name: 'openParent',
      label: '',
      icon: 'mdi-arrow-up',
      actionType: 'overall',
      execute: async ({ viewModel, pageCtx, viewService }) => {
        viewModel.methods.setFileId(pageCtx.folder.folder.id, pageCtx, viewService.isPage);
      },
      disabled: ({ pageCtx }) => {
        return !pageCtx.folder?.folder;
      }
    },
    {
      name: 'openFile',
      label: 'Open',
      icon: 'mdi-open-in-new',
      actionType: 'single',
      execute: async ({ viewModel, selectedId, pageCtx, viewService }) => {
        viewModel.methods.setFileId(selectedId, pageCtx, viewService.isPage);
      }
    },
    {
      name: 'addFile',
      label: '',
      dropdownIcon: 'mdi-plus',
      children: ['newFolder', 'uploadFile', 'newSheet', 'newDoc', 'newMarkdown', 'newDiagram']
    },
    {
      name: 'newFolder',
      label: 'New Folder',
      icon: 'mdi-folder-outline',
      actionType: 'overall',
      execute: async ({ pageCtx, viewModel, viewService, registry: { uiService } }) => {
        await uiService.openDetail({
          view: viewModel,
          parentView: viewService,
          data: {
            folder: pageCtx.folder,
            isFolder: true
          }
        });
      }
    },
    {
      name: 'newSheet',
      label: 'New Sheet',
      icon: 'mdi-file-excel-outline',
      actionType: 'overall',
      execute: ({ pageCtx, registry: { storageClient } }) =>
        storageClient.openView({
          name: 'NewSheet.xlsx',
          folder: pageCtx.folder
        })
    },
    {
      name: 'newDoc',
      label: 'New Document',
      icon: 'mdi-file-document-outline',
      actionType: 'overall',
      execute: ({ pageCtx, registry: { storageClient } }) =>
        storageClient.openView({
          name: 'NewDoc.docx',
          folder: pageCtx.folder
        })
    },
    {
      name: 'newMarkdown',
      label: 'New Markdown',
      icon: 'mdi-language-markdown-outline',
      actionType: 'overall',
      execute: ({ pageCtx, registry: { storageClient } }) =>
        storageClient.openView({
          name: 'NewMarkdown.md',
          folder: pageCtx.folder
        })
    },
    {
      name: 'newDiagram',
      label: 'New Diagram',
      icon: 'mdi-set-none',
      actionType: 'overall',
      execute: ({ pageCtx, registry: { storageClient } }) =>
        storageClient.openView({
          name: 'NewDiagram.diagram',
          folder: pageCtx.folder
        })
    }
  ]
})
export class File extends Owned {
  @Field({ type: 'StringField', cols: 12, required: true, autofocus: true })
  name: string;

  @Field({
    type: 'NumberField',
    label: 'Size',
    updatable: false,
    creatable: false,
    valueFormatter: ({ value, registry: { common } }) => common.formatBytes(value)
  })
  contentSize?: number;

  @Field({ type: 'StringField', creatable: false, updatable: false })
  contentType?: string;

  @Field({
    type: 'LookupField',
    relatedView: 'files',
    filter: { field: 'isFolder', value: true },
    hidden: true,
    required: true,
    notNull: true
  })
  folder?: any;

  @Field({ type: 'CheckboxField', updatable: false, notNull: true, columnDefault: false })
  isFolder?: boolean;

  @Field({ type: 'LookupField', relatedView: 'spaces', updatable: false, required: true, notNull: true })
  space?: any;

  @Field({ type: 'LookupField', relatedView: 'storages', updatable: false, required: true, notNull: true })
  storage?: any;

  @Field({ type: 'StringField' })
  storedFileId?: string;

  @Field({
    type: 'StringField',
    temporary: true,
    allowHtml: true,
    width: 70,
    label: '',
    valueFormatter: ({ data, registry: { storageClient } }) => {
      const icon = storageClient.getIcon(data);
      return `<i class="mdi ${icon} q-pr-xs files-icon"></i>`;
    }
  })
  icon?: string;

  @Field({
    type: 'StringField',
    temporary: true,
    valueFormatter: ({ data, registry: { dayjs } }) => dayjs(data.updatedAt).fromNow()
  })
  fromNow?: string;

  @Field({ type: 'JsonField', temporary: true })
  ancestors?: File[];

  @Field({
    type: 'BreadcrumbField',
    cols: 6,
    items: ({ viewModel, pageCtx, viewService }) => {
      const ancestors: File[] = pageCtx.folder?.ancestors;
      return ancestors?.map((ancestor, index) => ({
        text: ancestor.name,
        onItemClick: ({ pageCtx }) => {
          viewModel.methods.setFileId(ancestor.id, pageCtx, viewService.isPage);
        },
        iconCss: index == 0 ? 'mdi mdi-file-tree' : undefined
      }));
    }
  })
  breadcrumb?: string;

  @Field({ type: 'CheckboxField', notNull: true, columnDefault: false })
  allowDuplicateFileNames?: boolean;

  @Field({ type: 'CheckboxField', notNull: true, columnDefault: false })
  isImmutable?: boolean;
}

export const fileList = {
  type: 'ListView',
  parent: 'files',
  itemClickAction: 'openFile',
  listSections: [
    { listFields: ['icon'], side: true },
    { listFields: ['name'] },
    { listFields: ['owner', 'fromNow'], side: true }
  ]
};

export const attachedFileList = {
  type: 'ListView',
  parent: 'files',
  listSections: [
    { listFields: ['icon'], side: true },
    { listFields: ['name'] },
    { listFields: ['owner', 'fromNow'] },
    { listFields: ['actions'], side: true }
  ],
  fields: [
    {
      type: 'ActionField',
      name: 'actions',
      actions: ['downloadFile', 'openFile', 'removeAttachedItem']
    }
  ]
};
