import { DataViewModel, FormViewModel, ViewModel, WebActionModel } from 'index';

export const saveViewAs: WebActionModel = {
  icon: 'mdi-content-copy',
  ellipsis: true,
  execute: async ({ viewService, viewModel, registry: { uiService, authService, common } }) => {
    const view: FormViewModel = {
      parent: 'models',
      serverView: 'views',
      type: 'FormView',
      label: 'Save view as',
      viewActions: ['submitForm'],
      formFields: ['name', 'label', 'acl'],
      fieldGroups: null
    };

    const data: DataViewModel = {
      parent: viewModel.name,
      viewGroup: viewModel.viewGroup,
      label: viewModel.label
    };

    data.componentProps = viewService.getComponentProps?.();
    data.pageCtxDefaultData = viewService.pageCtx;
    const copyProps = ['columnFields'];
    for (const prop of copyProps) data[prop] = viewModel[prop];

    if (!authService.isAdmin()) {
      view.formFields = ['label'];
      data.name = authService.user.id + '$' + common.randomString(8);
      // private 모델은 serverView가 될수 없어 parent model을 serverView로 함
      data.serverView = viewModel.name;
      data.acl = 'private';
    }

    await uiService.openModal({ view, data, parentView: viewService });
  },
  hidden: ({ viewModel, registry: { authService } }) => !viewModel.viewGroup || !authService.user
};

export const saveView: WebActionModel = {
  name: 'saveView',
  icon: 'mdi-content-save',
  ellipsis: true,
  execute: async ({ viewService, viewModel, registry: { uiService, modelService } }) => {
    const view: FormViewModel = {
      parent: 'models',
      serverView: 'views',
      type: 'FormView',
      label: 'Save view',
      viewActions: ['submitForm'],
      formFields: ['name', 'label'],
      fieldGroups: null
    };

    const data: ViewModel = Object.assign({}, modelService.findByName(viewModel.name, 'views'));

    data.componentProps = viewService.getComponentProps?.();
    data.pageCtxDefaultData = viewService.pageCtx;
    const copyProps = ['columnFields'];
    for (const prop of copyProps) data[prop] = viewModel[prop];

    await uiService.openModal({ view, data, parentView: viewService });
  },
  hidden: ({ viewModel, registry: { authService } }) =>
    !authService.user || (viewModel.owner != authService.user.id && !authService.isAdmin())
};
