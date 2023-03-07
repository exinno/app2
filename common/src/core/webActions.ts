import { DataWebActionModel, SaveOptions } from 'index';

const list: DataWebActionModel[] = [
  {
    name: '-' // q-separator
  },
  {
    name: '--' // q-space
  },
  {
    name: 'refresh',
    icon: 'mdi-refresh',
    actionType: 'overall',
    permission: 'find',
    ellipsis: true,
    execute: ({ viewService }) => {
      viewService.refresh();
    },
    hidden: ({ registry: { modelService }, viewModel, viewService }) => {
      return !modelService.getServerView(viewModel) || viewService.isNew;
    }
  },
  {
    name: 'save',
    label: 'Save',
    icon: 'mdi-check',
    actionType: 'overall',
    permission: 'save',
    async execute({ registry: { dataService, modelService }, viewModel, selectedData }) {
      const view = modelService.getServerView(viewModel);
      const saveOptions: SaveOptions = {
        view,
        data: [selectedData]
      };

      return await dataService.save(saveOptions);
    }
  },
  {
    name: 'toggleMenu',
    actionType: 'overall',
    icon: 'mdi-menu',
    execute: ({ registry: { uiService } }) => {
      uiService.toggleMenu();
    }
  },
  {
    name: 'toggleRightView',
    actionType: 'overall',
    icon: 'mdi-chevron-right-box',
    execute: async ({ registry: { uiService } }) => {
      uiService.toggleRightView();
    }
  },
  {
    name: 'fullscreen',
    label: 'Full screen',
    actionType: 'overall',
    icon: 'mdi-fullscreen',
    execute: async ({ registry: { uiService } }) => {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        uiService.menuOpened = false;
        return true;
      } else if (document.exitFullscreen) {
        await document.exitFullscreen();
        uiService.menuOpened = true;
        return false;
      }
    }
  },
  {
    name: 'shareLink',
    icon: 'mdi-share',
    actionType: 'overall',
    ellipsis: true,
    async execute({ registry: { modelService, messageService }, selectedData, selectedId, viewModel }) {
      let viewName;
      let uri;
      if (selectedData.objectType && selectedData.objectId) {
        // from Share(ACL) view
        const isView = selectedData.objectType === 'views';
        viewName = isView ? selectedData.objectId : selectedData.objectType;
        uri = viewName + (isView ? '' : `/${selectedData.objectId}`);
      } else {
        // from View of link
        viewName = viewModel.name ?? viewModel.parent;
        uri = viewName + (!selectedId ? '' : `/${selectedId}`);
      }

      const viewLabel = messageService.getLabel(modelService.getView(viewName));
      const shareData = {
        title: `Shared ${viewLabel} Link`,
        url: `${window.location.origin}/#/${uri}`
      };
      try {
        await navigator.share(shareData);
      } catch {}
    },
    hidden: ({ registry: { modelService }, viewModel, viewService }) => {
      return !modelService.getServerView(viewModel) || viewService.isNew;
    }
  },
  {
    name: 'undo',
    icon: 'mdi-arrow-u-left-bottom',
    actionType: 'single',
    ellipsis: true,
    shortcutKey: 'Ctrl+Z',
    execute: ({ viewService }) => {
      viewService.undoService.undo();
    },
    disabled: ({ viewService }) => {
      return !viewService.undoService.undoStack?.length;
    },
    hidden: ({ viewModel }) => {
      return !viewModel.enableUndo;
    }
  },
  {
    name: 'redo',
    icon: 'mdi-arrow-u-right-bottom',
    actionType: 'single',
    ellipsis: true,
    shortcutKey: 'Ctrl+Y',
    execute: ({ viewService }) => {
      viewService.undoService.redo();
    },
    disabled: ({ viewService }) => {
      return !viewService.undoService.redoStack?.length;
    },
    hidden: ({ viewModel }) => {
      return !viewModel.enableUndo;
    }
  },
  {
    name: 'bookmarkView',
    label: '',
    icon: ({ registry: { bookmarkService }, value }) => {
      return bookmarkService.isBookmarked(value) ? 'mdi-star' : 'mdi-star-outline';
    },
    actionType: 'overall',
    execute: async ({ registry: { bookmarkService }, viewService, value }) => {
      await bookmarkService.toggle(viewService, value);
    }
  },
  {
    name: 'viewInNewTab',
    label: 'New Tab',
    icon: 'mdi-tab',
    ellipsis: false,
    execute: ({ value }) => {
      window.open(`#${value.path ?? '/' + value.name}`, '_blank');
    }
  },
  {
    name: 'submitSelected',
    label: 'Select',
    icon: 'mdi-check',
    actionType: 'multiple',
    execute: async ({ viewService, selectedData }) => {
      viewService.submit(selectedData);
    }
  },
  {
    name: 'openChatbot',
    label: 'Chatbot',
    icon: 'mdi-robot',
    ellipsis: false,
    execute: ({ registry: { uiService } }) => {
      const open = uiService.openedRightView?.view?.name != 'chatbot';
      if (open) void uiService.openRightView({ view: 'chatbot' });
      else uiService.close(uiService.openedRightView);
    },
    selected: ({ registry: { uiService } }) => {
      return uiService.openedRightView?.view?.name == 'chatbot';
    }
  }
];

export default list;
