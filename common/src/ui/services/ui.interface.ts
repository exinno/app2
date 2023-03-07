import {
  Dict,
  ViewService,
  MenuItem,
  Model,
  OpenedModel,
  ViewModel,
  OpenType,
  OpenSize,
  PageCtx,
  OpenViewModel,
  NavigationModel,
  RouteParams
} from 'index';

export type ComponentType = 'View' | 'Field' | 'Layout' | 'Wrapper';

export interface ConfirmModel {
  opened?: boolean;
  message?: string;
  icon?: string;
  cancelLabel?: string;
  okLabel?: string;
  resolve?: (success: boolean) => void;
}

export interface NotifyOptions {
  type?: 'positive' | 'negative' | 'warning' | 'info' | 'ongoing';
  color?: string;
  textColor?: string;
  message?: string;
  caption?: string;
  html?: boolean;
  icon?: string;
  iconColor?: string;
  iconSize?: string;
  avatar?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'bottom' | 'left' | 'right' | 'center';
  progress?: boolean;
  classes?: string;
  timeout?: number;
  actions?: any[];
  multiLine?: boolean;
}

export interface OpenOptions {
  // TODO: ViewModel typing
  view: OpenViewModel | string;
  openType?: OpenType;
  openSize?: OpenSize;
  overlay?: boolean;
  width?: number;
  parentView?: ViewService;
  dataId?: any;
  data?: any;
  pageCtx?: PageCtx;
}

export interface UiService {
  screen: Screen;
  menuOpened: boolean;
  rightViewOpened: boolean;
  openedModels: OpenedModel[];
  designerModel?: Model;
  designerSelectedModel?: Model;
  designerDroppableModel?: Model;
  appUpdateKey: number;
  updateApp();
  get openedModals(): OpenedModel[];
  get openedPanels(): OpenedModel[];
  get openedRightView(): OpenedModel | undefined;
  get lastOpened(): OpenedModel | undefined;
  openView(options: OpenOptions): Promise<any>;
  openDetail(options: OpenOptions): Promise<any>;
  openModal(options: OpenOptions): Promise<any>;
  openPanel(options: OpenOptions): Promise<any>;
  openRightView(options: OpenOptions): Promise<any>;
  openRoute(options: OpenOptions): Promise<any>;
  openParent(): void;
  close(openView?: OpenedModel): void;
  toggleMenu(): void;
  toggleRightView(): void;
  confirmModel: ConfirmModel;
  confirm(options: ConfirmModel): Promise<boolean>;
  resolveConfirm?: (value: boolean) => void;
  notify(options: NotifyOptions): void;
  showLoading(delay?: number): void;
  hideLoading(): void;
  registerComponents(type: ComponentType, components: Dict): void;
  getComponent(type: ComponentType, name?: string);
  getComponentNames(type: ComponentType): string[];
  getParentView(viewModel: ViewModel);
  isDesignerSelected(model: Model): boolean;
  isDesignerDroppable(model: Model): boolean;
  nextTick(fn?: (this: any) => void): Promise<void>;
}

export interface NavigationService {
  get model(): NavigationModel;
  filterValue: string;
  currentMenuName: string;
  get listMenuItems(): MenuItem[];
  get tabMenuItems(): MenuItem[];
  get userMenuActions(): string[];
  get listMenuActions(): string[] | undefined;
  get current(): MenuItem | undefined;
  get(menuName: string);
  go(menu: MenuItem): void;
  getRouteParams(menu: MenuItem): RouteParams | undefined;
  isCurrent(menu: MenuItem, path: string): boolean;
  opened(menu: MenuItem, path: string): boolean;
}

export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface Screen {
  /**
   * Screen width (in pixels)
   */
  width: number;
  /**
   * Screen height (in pixels)
   */
  height: number;
  /**
   * Tells current window breakpoint
   */
  name: ScreenSize;
  /**
   * Breakpoints (in pixels)
   */
  sizes: {
    /**
     * Breakpoint width size (minimum size)
     */
    sm: number;
    /**
     * Breakpoint width size (minimum size)
     */
    md: number;
    /**
     * Breakpoint width size (minimum size)
     */
    lg: number;
    /**
     * Breakpoint width size (minimum size)
     */
    xl: number;
  };
  /**
   * Tells if current screen width is lower than breakpoint-name
   */
  lt: {
    /**
     * Is current screen width lower than this breakpoint's lowest limit?
     */
    sm: boolean;
    /**
     * Is current screen width lower than this breakpoint's lowest limit?
     */
    md: boolean;
    /**
     * Is current screen width lower than this breakpoint's lowest limit?
     */
    lg: boolean;
    /**
     * Is current screen width lower than this breakpoint's lowest limit?
     */
    xl: boolean;
  };
  /**
   * Tells if current screen width is greater than breakpoint-name
   */
  gt: {
    /**
     * Is current screen width greater than this breakpoint's max limit?
     */
    xs: boolean;
    /**
     * Is current screen width greater than this breakpoint's max limit?
     */
    sm: boolean;
    /**
     * Is current screen width greater than this breakpoint's max limit?
     */
    md: boolean;
    /**
     * Is current screen width greater than this breakpoint's max limit?
     */
    lg: boolean;
  };
  /**
   * Current screen width fits exactly 'xs' breakpoint
   */
  xs: boolean;
  /**
   * Current screen width fits exactly 'sm' breakpoint
   */
  sm: boolean;
  /**
   * Current screen width fits exactly 'md' breakpoint
   */
  md: boolean;
  /**
   * Current screen width fits exactly 'lg' breakpoint
   */
  lg: boolean;
  /**
   * Current screen width fits exactly 'xl' breakpoint
   */
  xl: boolean;
}

export interface RouteLocation {
  name: string;
  path: string;
  hash: string;
  query: Dict;
  params: Dict;
  matched: any;
  fullPath: string;
  redirectedFrom: any;
  meta: any;
}
