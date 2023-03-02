import { Dict, AnyFieldModel, fieldsSelectField, PageCtx, registry, ScreenSize, Permission } from '..';
import {
  AnyViewModel,
  dictPropField,
  Model,
  PropOptions,
  ServerActionModel,
  voidPropField,
  WebActionModel,
  webActionsSelectField,
  stringPropField,
  ActionModel
} from '.';
import { Field, View } from './model.decorator';

export const hintModes = ['tooltip', 'bottom', 'button'] as const;
export type HintMode = typeof hintModes[number];

/** View model */
@View({
  name: 'views',
  table: 'views',
  type: 'DataGridView',
  parent: 'models',
  detailView: {
    parent: 'viewDesigner',
    openType: 'modal',
    openSize: 'maximized'
  },
  hintMode: 'tooltip',
  fieldGroups: [
    {
      label: 'Basic options',
      groupFields: [
        'name',
        'label',
        'icon',
        'hint',
        'type',
        'mixins',
        'parent',
        'acl',
        'category',
        'owner',
        'configure'
      ],
      defaultOpened: true
    },
    {
      label: 'Actions',
      groupFields: ['viewActions', 'webActions', 'serverActions', 'hideActionLabel', 'viewActionsOn']
    },
    {
      label: 'Web events',
      groupFields: ['onClick', 'onRightClick', 'onCreated', 'onMounted', 'onUnmounted']
    },
    {
      label: 'Secondary views',
      groupFields: ['detailView', 'rightView']
    },
    {
      label: 'Layout options',
      groupFields: [
        'readonly',
        'hintMode',
        'hideToolbar',
        'width',
        'height',
        'layout',
        'wrapper',
        'wrapperClass',
        'viewClass'
      ]
    },
    {
      label: 'Props & Style',
      groupFields: ['hintMode', 'hidden', 'dense', 'droppable', 'componentProps', 'containerProps', 'containerStyle']
    }
  ],
  serverFilter: {
    filters: [
      {
        field: '_isType',
        operator: 'ne',
        value: true
      },
      {
        field: '_abstract',
        operator: 'ne',
        value: true
      },
      {
        field: 'parent',
        operator: 'ne',
        value: 'views'
      }
    ]
  },
  columnFields: ['name', 'label', 'type', 'acl', 'category', 'owner'],
  viewActions: [
    'openAdd',
    'openEdit',
    'openRemove',
    'openAsView',
    'openQueryBuilder',
    'exportExcel',
    'openActivities',
    'refresh',
    'updateSchemaAll',
    'loadCsv'
  ],
  webActions: [
    {
      name: 'openAsView',
      icon: 'mdi-open-in-new',
      actionType: 'single',
      execute: ({ registry: { uiService, modelService }, selectedData: data, viewService }) =>
        uiService.openModal({ view: modelService.getView(data.name), parentView: viewService })
    },
    {
      name: 'updateSchemaAll',
      label: 'Update Schema',
      icon: 'mdi-database-sync',
      actionType: 'overall',
      async execute({ registry: { httpClient, uiService } }) {
        const result = await httpClient.get('data/updateSchemaAll');
        uiService.notify({ message: result || 'All schema updated.' });
      }
    }
  ]
})
export class ViewModel<S extends ViewService = any> extends Model {
  @Field()
  viewGroup?: string;

  @Field({
    type: 'SelectField',
    keyField: 'name',
    labelField: 'label',
    iconField: 'icon',
    optionItems: ({ registry: { navigationService } }) =>
      navigationService.listMenuItems.filter((menuItem) => typeof menuItem.children != 'function')
  })
  parentMenu?: string;

  @Field()
  /** View component name registered in uiService */
  component?: string;

  @Field()
  subLabel?: string | (<T extends this>(options: PropOptions<T>) => string);

  /** Which wrapper component to use in view. */
  @Field({
    type: 'SelectField',
    optionItems: ({ registry: { uiService } }) => uiService.getComponentNames('Wrapper')
  })
  wrapper?: string = 'MainWrapper';

  /** Which layout component to use in view. */
  @Field({
    type: 'SelectField',
    optionItems: ({ registry: { uiService } }) => uiService.getComponentNames('Layout')
  })
  layout?: string = 'MainLayout';

  /** WrapperClass attribute specifies classnames for a wrapper. The class attribute is mostly used to point to a class in a style sheet. */
  @Field(dictPropField)
  wrapperClass?: Dict;

  /** ViewClass attribute specifies classnames for a view. The class attribute is mostly used to point to a class in a style sheet. */
  @Field(dictPropField)
  viewClass?: string | Dict | (<T extends this>(options: PropOptions<T>) => Dict);

  /** Whether to put action buttons in view or toolbar. */
  @Field({
    type: 'SelectField',
    multiple: true,
    optionItems: ['toolbar', 'bottom']
  })
  viewActionsOn?: ('toolbar' | 'bottom')[] = ['toolbar'];

  @Field()
  viewActionsClass?: string | Dict;

  /** Whether to hide or set size (xs, sm, md, lg, xl) of label in view action. //TODO size not working
   *  Default value is false. */
  @Field() hideActionLabel?: boolean | ScreenSize = false;

  /** Whether view is read only or not. View with readonly property cannot be modified.
   *  Default value is false. */
  @Field() readonly?: boolean = false;

  /** Whether to hide toolbar in view page or not.
   *  Default value is false. */
  @Field() hideToolbar?: boolean = false;

  /** Properties to add when detail form is opened. Type of the detailView must be 'formView'.
   *  Properties applies to forms classified as detail form. //TODO how to tell if its openDetail. openEdit vs shareView
   *  Users can set what fields and actions to show up in the form. */
  @Field({
    type: 'ModalViewField',
    icon: 'mdi-dock-window',
    view: 'openView'
  })
  detailView?: OpenViewModel | string;

  newView?: OpenViewModel | string;

  @Field()
  mobileView?: AnyViewModel | string;

  /** View with right panel property will have arrow button at top right corner.
   *  Users can define view model in right panel property to see which view to appear. */
  @Field({
    type: 'ModalViewField',
    icon: 'mdi-chevron-right-box-outline',
    view: {
      parent: 'views',
      label: 'Right Panel',
      type: 'FormView',
      noServer: true
    }
  })
  rightView?: AnyViewModel;

  /** Web actions do expected client action in view. Users can define webActions property in view model or at webActions page.
   *  ActionType property represent whether web action can be triggered when single item is selected or multiple items are selected or overall(does not have to be selected).
   *  Once web action is created make sure to put in view actions. And use viewActionsOn property to choose the place of button, either 'tooltip' or 'view'.
   *  Users can assign action permission in 'Share View'.
   *  TODO serverACtion compatibility?
   */
  @Field({
    type: 'ModalViewField',
    dataType: 'array',
    icon: 'mdi-web-sync',
    openSize: 'maximized',
    view: {
      parent: 'webActions',
      noServer: true
    }
  })
  webActions?: WebActionModel<S, any>[];

  /** Server actions do expected server action in view. Users can define serverActions property in view model or at serverActions page.
   *  Actions are used to modify data. Server actions can be written as raw query.
   *  ActionType property represent whether web action can be triggered when single item is selected or multiple items are selected or overall (does not have to be selected).
   *  Once server action is created make sure to put in view actions. And use viewActionsOn property to choose the place of button, either 'tooltip' or 'view'.
   *  Users can assign action permission in 'Share View'. */
  @Field({
    type: 'ModalViewField',
    dataType: 'array',
    icon: 'mdi-cloud-sync',
    openSize: 'maximized',
    view: {
      parent: 'serverActions',
      noServer: true
    }
  })
  serverActions?: ServerActionModel[];

  /** What actions to be shown on view. */
  @Field({
    type: 'PropField',
    propType: 'string[] | (<T extends this>(options: PropOptions<T>) => string[])',
    inputField: webActionsSelectField
  })
  viewActions?: string[] | (<T extends this>(options: PropOptions<T>) => string[]);

  /** Width of the view. Best to include unit (cm, mm, in, px, rem, etc.) when writing in string. */
  @Field() width?: string | number;

  /** Height of the view. Best to include unit (cm, mm, in, px, rem, etc.) when writing in string. */
  @Field() height?: string | number;

  /** What property options to pass to the component. */
  @Field({ type: 'PropField', propType: 'Dict' })
  componentProps?: Dict;

  /** Expected callback to be called on click. */
  @Field(voidPropField)
  onClick?: <T extends this>(options: PropOptions<T>) => void;

  /** Expected callback to be called on right click. */
  @Field(voidPropField)
  onRightClick?: <T extends this>(options: PropOptions<T>) => void;

  /** Expected callback to be called on right click. */
  @Field(voidPropField)
  onDrop?: <T extends this>(options: PropOptions<T>) => void;

  /** Expected callback to be called after the component has been created. */
  @Field(voidPropField)
  onCreated?: <T extends this>(options: PropOptions<T>) => void;

  /** Expected callback to be called after the component has been mounted. */
  @Field(voidPropField)
  onMounted?: <T extends this>(options: PropOptions<T>) => void;

  /** Expected callback to be called after the component has been unmounted. */
  @Field(voidPropField)
  onUnmounted?: <T extends this>(options: PropOptions<T>) => void;

  /** Expected callback to be called after the viewService.refresh called. */
  @Field(voidPropField)
  onRefresh?: <T extends this>(options: PropOptions<T>) => void;

  @Field(voidPropField)
  onDataChange?: <T extends this>(options: PropOptions<T>) => void;

  @Field(voidPropField)
  onDataIdChange?: <T extends this>(options: PropOptions<T>) => void;

  @Field(voidPropField)
  onRouteChange?: <T extends this>(options: PropOptions<T>) => void;

  @Field({ type: 'PropField', propType: 'Dict' })
  watches?: WatchModel<ViewModel>[];

  /** Used to set properties of container view.
   *  Container view is a proxy view that stands in for the content of a child view controller. */
  @Field({ type: 'PropField', propType: 'Dict' })
  containerProps?: Dict;

  /** Used to set CSS style of container view.
   *  Container view is a proxy view that stands in for the content of a child view controller. */
  @Field({ type: 'PropField', propType: 'Dict' })
  containerStyle?: Dict;

  @Field()
  viewLabelStyle?: 'dropDown' | 'toggle' = 'dropDown';

  /** Define list of fields view will have. Variety of properties can be added based on type of the field (Each field must define type property).
   *  Once view's field is created or updated, user should run 'updateSchema' to reflect to database.
   *  User with right permission can update schema by clicking on 'updateSchema' button located in 'Screen' screen.
   *  Changes or creation made in designer automatically update or insert to database upon saving. */
  @Field({
    type: 'DataGridField',
    cols: 12,
    dataGridModel: {
      parent: 'fields',
      columnFields: ['label', 'type', 'name'],
      allowRowDragAndDrop: true
    }
  })
  fields?: AnyFieldModel[];

  /** 'paramField' allows items to be used as a filter of the view. */
  @Field(fieldsSelectField)
  pageFields?: string[] | (<T extends this>(options: PropOptions<T>) => string[]);

  @Field(fieldsSelectField)
  paramFields?: string[] | (<T extends this>(options: PropOptions<T>) => string[]);

  @Field(fieldsSelectField)
  filterFields?: string[];

  /** Expected callback or value in view model to be called. Returned parameter will be used as a default filter value of the view.
   *  Parameter could be changed by selecting the parameter in pageFields(List of select fields). */
  @Field(dictPropField)
  pageCtxDefaultData?: Dict | (<T extends this>(options: PropOptions<T>) => Dict);

  /** Whether to automatically apply refresh upon selecting param fields.
   *  Need to manually click on refresh button to get filtered record if 'refreshOnFilterChange' is false. */
  @Field()
  refreshOnFilterChange?: boolean;

  @Field()
  openDetailByDataId?: boolean = true;

  @Field()
  ignoreProps?: boolean;

  /** How hint (description) should be shown on view. It supports tooltip, button, bottom mode.
   *  tooltip = Hint shows up during mouse over.
   *  button = Question mark button appears next to the label. Click on to see the hint.
   *  bottom =  Hint shows up at bottom. */
  @Field() hintMode?: HintMode;

  /** Whether view is hidden or not.
   *  View with hidden property as true does not appear on view.
   *  Defaults to false. */
  @Field({
    type: 'PropField',
    propType: 'boolean | ((options: PropOptions<ViewModel>) => boolean)',
    cols: 12
  })
  hidden?: boolean | (<T extends this>(options: PropOptions<T>) => boolean);

  @Field()
  dense?: boolean;

  @Field()
  droppable?: boolean | (<T extends this>(options: PropOptions<T>) => boolean);

  @Field({
    type: 'PropField',
    propType: 'any'
  })
  data?: any;

  /** Its value is used for addressability of the app.
   *  If corresponding record id type is string then upon opening detail view or modal, dataId property is created in view model with value of record id.
   *  So that, others can open specific form or modal when the link is shared.
   *  If not data property is created in view model with value of record id. */
  @Field(stringPropField)
  dataId?: string | (<T extends this>(options: PropOptions<T>) => string);
}

export const openTypes = ['modal', 'panel', 'rightView', 'route'] as const;
export type OpenType = typeof openTypes[number];
export const openSizes = ['maximized', 'full', 'fullWidth', 'fullHeight'] as const;
export type OpenSize = typeof openSizes[number];

export type OpenViewModel = AnyViewModel & {
  openType?: OpenType;
  openSize?: OpenSize;
};

export class OpenedModel {
  id: string;
  dataId?: string;
  data?: any;
  view: OpenViewModel;
  openType?: OpenType;
  openSize?: OpenSize;
  overlay?: boolean;
  opened?: boolean;
  width?: number;
  pageCtx?: PageCtx;
  zIndex?: number;
  resolve?: (success: boolean) => void;
}

export class ViewService<T extends ViewModel = ViewModel> {
  constructor(protected props: ViewProps<T>) {}

  private _data?: any;

  get model(): T {
    return this.props.model;
  }

  get data(): any {
    const data = registry.callProp(this.model, 'data', this.props);
    return this._data ?? data ?? this.props.modelValue;
  }

  set data(value: any) {
    this._data = value;
  }

  get dataId(): string | string[] | undefined {
    return this.props.dataId;
  }

  get isPage() {
    return this.props.isPage;
  }

  get parentView() {
    return this.props.parentView;
  }

  get pageCtx() {
    return this.props.pageCtx;
  }

  get serverView(): string {
    return registry.modelService?.getServerView(this.model);
  }

  component?: any;

  refresh?(): void;

  getComponentProps?(): Dict;

  permissions: Permission[];

  async getPermissions() {
    if (this.permissions) return this.permissions;
    const { modelService, aclService } = registry;

    const viewName = modelService.getServerView(this.model);
    if (!viewName) return ['any'];
    const hasGroupPermission = modelService.callProp<boolean>(this.model, 'hasGroupPermission', {
      viewService: this
    });
    const hasOwnerPermission = modelService.callProp<boolean>(this.model, 'hasOwnerPermission', {
      viewService: this
    });
    const permissions = await aclService.getPermissions({
      view: 'views',
      dataId: viewName,
      hasGroupPermission,
      hasOwnerPermission
    });
    // console.log('getPermissions', viewName, permissions, hasGroupPermission, hasOwnerPermission);
    const added = modelService.callProp<Permission[]>(this.model, 'addWebActionPermissions', {
      viewService: this
    });
    this.permissions = [...permissions, ...(added ?? [])];
    return this.permissions;
  }

  async executeAction(action: string, options?: Partial<PropOptions<ActionModel>>) {
    const { modelService } = registry;
    if (options.data) Object.assign(this.data, options.data);
    return await modelService.executeWebAction(action, {
      viewModel: this.model,
      viewService: this,
      data: this.data,
      dataId: this.dataId,
      selectedData: options.selectedData ?? (this as any).selectedData,
      pageCtx: this.pageCtx
    });
  }
}

export interface ViewProps<M extends Model> {
  model: M;
  modelValue?: any;
  selectedData?: any;
  dataId?: string | string[];
  isPage?: boolean;
  parentView?: ViewService;
  pageCtx?: PageCtx;
}

export interface WatchModel<T extends ViewModel> {
  watch: (options: PropOptions<T>) => any;
  execute: (options: PropOptions<T>) => void;
  immediate?: boolean;
  deep?: boolean;
}
