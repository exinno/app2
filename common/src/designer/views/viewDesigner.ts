import {
  AnyViewModel,
  ContainerViewModel,
  ContainerViewService,
  DataViewService,
  SplitViewModel,
  ViewModel
} from '../../../';

export const viewDesigner: SplitViewModel = {
  type: 'SplitView',
  label: 'Designer',
  children: [],
  methods: {
    deselectAll() {
      const { uiService } = $registry;
      uiService.designerSelectedModel = undefined;
    },
    findChild(model: ContainerViewModel, id: string) {
      if (model.id === id) return model;
      let found;
      const { modelService } = $registry;
      const children = modelService.callProp<AnyViewModel[]>(model, 'children') ?? [];
      for (const child of [...children, ...(model.fields ?? [])]) {
        found = this.findChild(child, id);
        if (found) {
          return found;
        }
      }
      return null;
    }
  },
  onUnmounted({ registry: { uiService } }) {
    uiService.designerModel = undefined;
    this.methods.deselectAll();
  },
  hideActionLabel: 'xs',
  viewActions: ['copyAsSubView', 'toggleLeft', 'toggleRight', 'saveView'],
  webActions: [
    {
      name: 'toggleLeft',
      label: 'Left',
      icon: 'mdi-dock-left',
      execute({ viewService }) {
        const splitView = viewService.model as SplitViewModel;

        if (splitView.sizes[0] == 100) splitView.sizes = [0, 100, 0];
        else splitView.sizes = [100, 0, 0];
      },
      hidden({ registry: { uiService } }) {
        return !uiService.screen.xs;
      }
    },
    {
      name: 'toggleRight',
      label: 'Right',
      icon: 'mdi-dock-right',
      execute({ viewService }) {
        const splitView = viewService.model as SplitViewModel;

        if (splitView.sizes[2] == 100) splitView.sizes = [0, 100, 0];
        else splitView.sizes = [0, 0, 100];
      },
      hidden({ registry: { uiService } }) {
        return !uiService.screen.xs;
      }
    },
    {
      name: 'saveView',
      label: 'Save',
      icon: 'mdi-check',
      async execute({ registry: { dataService, common, uiService }, viewModel, viewService }) {
        const form = (viewService.children[2] as ContainerViewService).children[0] as DataViewService;
        const valid = await form.validate();
        if (valid) {
          await dataService.save({ view: 'views', data: [common.removeStartsWith({ ...viewModel.data }, '$')] });
          uiService.notify({ message: 'Model saved!' });
        }
      },
      disabled({ registry: { authService }, data }) {
        return !(
          (data?.acl != 'private' && authService.user?.principals.includes('admin')) ||
          (data.$persisted &&
            data?.acl == 'private' &&
            (data?.owner == authService.user?.id || authService.user?.principals.includes('admin'))) ||
          !data.$persisted
        );
      }
    },
    {
      name: 'copyAsSubView',
      label: 'Copy',
      icon: 'mdi-tag-multiple',
      execute({ registry: { common, uiService }, viewModel }) {
        const viewData = viewModel.data as ViewModel;
        const subView: ViewModel = {
          type: viewData.type,
          parent: viewData.name,
          name: common.randomString(8),
          acl: 'private',
          $modelType: 'views'
        };
        common.replaceObject(uiService.designerModel, subView);
      },
      hidden({ registry: { modelService }, viewModel }) {
        const viewData = viewModel.data as ViewModel;
        return !viewData.name || !modelService.findByName(viewData.name, 'views');
      }
    },
    {
      name: 'copyAsNew',
      label: 'Clone',
      icon: 'mdi-tag-multiple',
      execute({ registry: { common, uiService }, viewModel }) {
        const viewData = viewModel.data as ViewModel;
        const subView: ViewModel = {
          ...viewData,
          name: common.randomString(8),
          acl: 'private',
          $persisted: undefined
        };
        common.replaceObject(uiService.designerModel, subView);
      }
    }
  ],
  configure({ registry: { _, modelService, uiService, messageService, common }, model, data, dataId }) {
    if (uiService.designerModel) {
      data = uiService.designerModel;
    } else {
      if (dataId && dataId !== '$new') {
        data = modelService.findByName(dataId as string, 'views');
        data = _.cloneDeep(data); // updateDirectly로 인해 원본 변경 방지
      } else {
        data ??= {
          type: 'DashboardView',
          label: 'New view'
        };
      }
      data = prepareModel(data);
      uiService.designerModel = data;
    }
    uiService.designerSelectedModel = data;

    function prepareModel(model) {
      model.id ??= common.randomString(8);
      model.$configureProxy = true;
      model.$modelType ??= 'views';

      for (const child of model.fields ?? []) {
        child.$modelType = 'fields';
        child.id ??= common.randomString(8);
        // prepareModel(child);
      }
      model = modelService.configure(model, {}, model.$modelType);
      for (const child of model.children ?? []) {
        prepareModel(child);
      }

      if (model.children) model.children = [];
      return model;
    }
    function getLabel(model: ViewModel) {
      let label = '';
      if (model.name) label += model.name;

      if (model.label) {
        if (label) label += ' (' + messageService.getLabel(model) + ')';
        else label += messageService.getLabel(model);
      }
      return label;
    }

    model.data = data;
    model.sizes = uiService.screen.xs ? [0, 100, 0] : [15, 65, 20];
    model.children = [
      {
        type: 'SplitView',
        hideToolbar: true,
        vertical: true,
        sizes: [30, 70],
        children: [
          {
            label: 'Component Tree',
            type: 'NestedListView',
            keyField: 'id',
            data: [data],
            onSelect({ value }) {
              uiService.designerSelectedModel = value;
            },
            selectedKey() {
              return uiService.designerSelectedModel?.id;
            },
            showDelete: true,
            singleRootNode: true,
            getLabel,
            dragGroup: 'viewDesigner',
            draggable: true,
            moveable: true,
            droppable: ({ value }) => {
              return Array.isArray(value);
            }
          },
          {
            label: 'All Components',
            type: 'NestedListView',
            showFilter: true,
            hideActionLabel: true,
            viewActions: ['previewView'],
            webActions: [
              {
                name: 'previewView',
                actionType: 'single',
                icon: 'mdi-open-in-app',
                execute: ({ registry: { uiService }, data, viewService }) => {
                  void uiService.openModal({ view: data, parentView: viewService });
                }
              }
            ],
            data: [
              {
                label: 'Built-in Types',
                children: _.sortBy(
                  modelService.getTypes('views').map((view) => ({
                    type: view.name,
                    label: messageService.getLabel(view)
                  })),
                  ['type']
                )
              },
              {
                label: 'Built-in Views',
                children: _.sortBy(
                  modelService.getViews().filter((view) => view.category == 'builtin'),
                  ['name']
                ).map((view) => ({
                  type: view.type,
                  parent: view.name,
                  label: messageService.getLabel(view)
                }))
              },
              {
                label: 'App Views',
                children: _.sortBy(
                  modelService.getViews().filter((view) => view.category != 'builtin'),
                  ['name']
                ).map((view) => ({
                  type: view.type,
                  parent: view.name,
                  label: messageService.getLabel(view)
                }))
              }
            ],
            getLabel,
            dragGroup: 'group1',
            draggable: (item) => {
              return !item.children;
            },
            droppable: false,
            cloneItem(item) {
              return prepareModel({ ...item });
            }
          }
        ]
      },
      {
        type: 'SectionView',
        component: 'DesignView',
        hideToolbar: true,
        children: [data],
        containerStyle: {
          border: '1px solid #eeeeee'
        },
        onRightClick: ({ value }) => {
          value.preventDefault();
          let selectedModelId;
          let target = value.target;

          const header = target.closest('.e-headercelldiv');
          if (header) {
            const grid = target.closest('.e-grid');
            const viewModel = grid.__vueParentComponent.parent.props.model;
            const fieldName = grid.ej2_instances[0].getColumnByUid(header.getAttribute('e-mappinguid')).field;
            const fieldId = viewModel.id + '/' + fieldName;
            if (this.methods.findChild(data, fieldId)) {
              selectedModelId = fieldId;
            }
          }
          if (!selectedModelId) {
            let parentComponent;
            while (!selectedModelId) {
              if (parentComponent) {
                if (parentComponent.props?.model) {
                  if (!parentComponent.props.model.id) throw new Error('id is null');
                  selectedModelId = parentComponent.props.model.id;
                } else {
                  parentComponent = parentComponent.parent;
                }
              } else {
                target = target.parentElement;
                parentComponent = target.__vueParentComponent;
              }
            }
          }
          uiService.designerSelectedModel = this.methods.findChild(data, selectedModelId);
        }
      },
      {
        type: 'TabView',
        hideToolbar: true,
        defaultTab: 0,
        children: [
          {
            label: 'Property',
            type: 'FormView',
            hideToolbar: true,
            data: () => uiService.designerSelectedModel,
            componentProps: {
              defaultCols: 12,
              updateDirectly: true
            },
            configure: ({ model, registry: { modelService } }) => {
              // model type이 바뀌면 Property view model을 해당 model type용으로 변경 (eg. Data Grid Options)
              const modelType = uiService.designerSelectedModel?.$modelType ?? 'fields';
              if (modelType) {
                const view = _.lowerFirst(uiService.designerSelectedModel.type);
                model.parent = view;
                const modelView = modelService.getView(modelService.findByName(view, 'views') ? view : modelType);
                // configure가 extend이후에 호출되어 parent을 동적으로 바꿀 수 없음
                Object.assign(model, { ...modelView, ...model });
              }
            }
          },
          {
            label: 'Code',
            type: 'ScriptView',
            hideToolbar: true,
            data: () => uiService.designerSelectedModel,
            updateDirectly: true,
            serializeNeeded: true,
            autoSave: true,
            formatting: true,
            ignoreStartsWith: '$',
            configure: ({ registry: { _ }, model }) => {
              // model type이 바뀌면 model 변수 이름 및 type을 변경
              const type = uiService.designerSelectedModel.type + 'Model';
              const name = _.lowerFirst(uiService.designerSelectedModel.type);
              model.extraLib = `let ${name}: ${type}`;
              model.sourcePrefix = `${name} = `;
            }
          }
        ]
      }
    ];
  }
};
