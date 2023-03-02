import { WebActionModel } from '../../../model';

export const newView: WebActionModel = {
  dropdownIcon: 'mdi-view-grid-plus',
  children: ['aiModelStudio', 'createNewView', 'designNewView', 'createWithExcel', 'createWithPaste']
};

export const createNewView: WebActionModel = {
  label: 'Create blank view',
  icon: 'mdi-file',
  execute: async ({ registry: { uiService } }) => {
    const view = await uiService.openModal({
      view: 'createNewView',
      data: {
        type: 'DataGridView',
        datasource: 'default'
      }
    });
    if (!view) return;
    setTimeout(() => uiService.openRoute({ view: '/' + view.name }), 500);
  }
};

export const designNewView: WebActionModel = {
  label: 'Design new view',
  icon: 'mdi-pencil-ruler',
  execute: async ({ registry: { uiService } }) => {
    await uiService.openModal({
      view: 'viewDesigner',
      data: {
        type: 'DataGridView'
      },
      openSize: 'maximized'
    });
  }
};

export const aiModelStudio: WebActionModel = {
  label: 'AI Model Studio',
  icon: 'mdi-crane',
  ellipsis: true,
  execute: async ({ registry: { uiService } }) => {
    await uiService.openRoute({ view: 'aiModelStudio' });
  }
};

export const createWithExcel: WebActionModel = {
  label: 'Create view from Excel(+ CSV)',
  icon: 'mdi-microsoft-excel',
  execute: async ({ registry: { uiService }, viewService }) => {
    await uiService.openModal({
      view: {
        parent: 'createViewWith',
        type: 'CustomView',
        viewActions: ['importFile', 'save'],
        webActions: [
          {
            name: 'importFile',
            label: 'Import File',
            icon: 'mdi-file-excel',
            execute: ({ viewService }) => viewService.uploadFile()
          }
        ]
      },
      parentView: viewService,
      pageCtx: { viewWithExcel: true }
    });
  }
};

export const createWithPaste: WebActionModel = {
  label: 'Create view from pasting table',
  icon: 'mdi-clipboard-text',
  execute: async ({ registry: { uiService }, viewService }) => {
    await uiService.openModal({
      view: {
        parent: 'createViewWith',
        type: 'CustomView',
        viewActions: ['pasteText', 'save'],
        webActions: [
          {
            name: 'pasteText',
            label: 'Paste(Ctrl-V)',
            icon: 'mdi-clipboard-text',
            execute: ({ viewService }) => viewService.pasteText()
          }
        ]
      },
      parentView: viewService,
      pageCtx: { viewWithPaste: true }
    });
  }
};
