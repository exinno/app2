import { Dict, ViewService, Registry, OrderBy, RouteLocation, ActionOptions, Context, User } from '..';
import { Model, ViewModel, FieldModel } from '.';

export type PageCtx = Dict & { __search?: string; __sort?: OrderBy };

export interface PropOptions<M extends Model, S extends ViewService = any, V extends ViewModel = ViewModel> {
  model: M;
  viewModel?: V;
  fieldModel?: FieldModel;
  data?: any;
  dataId?: string | string[]; // routing param dataId 또는 viewModel.dataId
  selectedData?: any;
  selectedId?: string | string[];
  value?: any; // Field에서 data는 해당 row, value는 field 값
  result?: any; // server after hooks에서 result 받기
  pageCtx?: PageCtx;
  user?: User;
  route?: RouteLocation;
  viewService?: S;
  registry: Registry;
}

export interface ServerPropOptions<T = any> extends ActionOptions<T> {
  result?: T;
  context?: Context;
  registry: Registry;
}
