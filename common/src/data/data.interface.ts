import { DatasourceModel, isString, User, DataViewModel } from '..';
import { SubscriptionLike } from 'rxjs';
import { Knex } from 'knex';

export type Dict<T = any> = { [k: string]: T };

export type Value =
  | string
  | number
  | boolean
  | null
  | Date
  | Array<string>
  | Array<number>
  | Array<Date>
  | Array<boolean>;

export type BoolOperator =
  | 'eq'
  | 'ne'
  | 'gt'
  | 'lt'
  | 'ge'
  | 'le'
  | 'notNull'
  | 'null'
  // string only
  | 'like'
  | 'ilike'
  | 'notLike'
  | 'contains'
  | 'containsi'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  // multiple value
  | 'in'
  | 'notIn'
  | 'between';

export type Logic = 'and' | 'or';

export interface Filter {
  logic?: Logic;
  field?: string;
  operator?: BoolOperator;
  value?: any;
  filters?: Filter[];
  $parent?: Filter;
}

export function isFilter(filter: any): filter is Filter {
  const keys = Object.keys(filter);
  const filterFields = ['logic', 'field', 'operator', 'value', 'filters'];

  return keys.every((key) => filterFields.includes(key));
}

export function filterToDict(filter: Filter | Dict, dict: Record<string, any> = {}) {
  if (!isFilter(filter)) return filter;

  if (filter.field && (!filter.operator || filter.operator === 'eq')) {
    dict[filter.field] = filter.value;
  }

  filter.filters?.forEach((f) => filterToDict(f, dict));

  return dict;
}

export interface OrderBy {
  field?: string;
  direction?: 'asc' | 'desc';
}

export interface Select {
  field?: string;
  aggFunc?: AggFunc;
}

export type AggFunc = 'sum' | 'min' | 'max' | 'avg' | 'count' | undefined;

export interface Indexes {
  //TODO indexOptions?
  indexName: string;
  fields: string[];
}

export interface ChangeItem {
  changeType: ChangeType;
  datasource?: string;
  table?: string;
  dataId?: any | any[];
  data?: Dict[];
  count?: number;
}

export type ChangeType = 'initial' | 'create' | 'update' | 'remove';

export interface Transaction {
  commit(): void;
  rollback(): void;
}

export interface Context {
  user?: User;
  remoteAddress?: string;
  requestedUrl?: string;
  transactions?: Dict<Transaction>;
  changeQueue?: ChangeItem[];
}

export interface Join {
  name?: string;
  on?: string;
  table?: string;
  raw?: string;
  joinType?: JoinType;
  params?: string;
}

export type JoinType =
  | 'join'
  | 'innerJoin'
  | 'leftJoin'
  | 'leftOuterJoin'
  | 'rightJoin'
  | 'rightOuterJoin'
  | 'fullOuterJoin'
  | 'crossJoin';

// TODO: 불필요한 property 최대한 삭제
export class DataOptions<T = any> {
  view?: string;
  table?: string;
  datasource?: string;
  data?: T;
  dataId?: any | any[];
  params?: Dict;
  filter?: Filter | Dict;
  context?: Context;
  datasourceModel?: DatasourceModel;
  viewModel?: DataViewModel;
  keyField?: string;
  skipAcl?: boolean;
  skipActivity?: boolean;
  skipEncryption?: boolean;
  skipNoRecord?: boolean;
  checkRecordAcl?: boolean;
  includePermissions?: boolean;
  hasGroupPermission?: boolean;
  hasOwnerPermission?: boolean;
  withoutTx?: boolean;
  serializer?: Serializer;
  knex?: Knex;
}

export type Serializer = 'json' | 'js';

export class FindOptions<T = any> extends DataOptions<T> {
  select?: string | (Select | string)[];
  orderBy?: (OrderBy | string)[];
  groupBy?: string[];
  joins?: Join[];
  top?: number;
  skip?: number;
  count?: boolean;
  flat?: boolean;
  computed?: boolean; // TODO: What?
  excludeRelation?: boolean; // TODO: What?
  $select?: string;
  $filter?: string;
  $orderby?: string;
  $apply?: string;
  $expand?: string;
  live?: boolean;
  livePrepend?: boolean;
}

export class SaveOptions<T = any> extends DataOptions<T> {
  batchInsert?: boolean;
  skipUpdateAtUpdate?: boolean;
}

export class ActionOptions<T = any> extends DataOptions<T> {
  action?: string;
}

export class SqlOptions<T = any> extends DataOptions<T> {
  sql: string;
}

export interface ActivityOptions extends ActionOptions {
  activityType: ActivityType;
  description?: string;
}

export const permissions = ['any', 'get', 'find', 'save', 'update', 'create', 'remove', 'export', 'manage'] as const;
export type Permission = typeof permissions[number];

export const activityTypes = [
  ...permissions,
  'executeAction',
  'alterTable',
  'createTable',
  'signIn',
  'signOut'
] as const;
export type ActivityType = typeof activityTypes[number];

export interface FindResult<T = Dict> {
  value: T[];
  count?: number;
  subscription?: SubscriptionLike;
}

export interface SubscribeOptions {
  next?: (changeItem: ChangeItem) => void;
  resultData?: Dict[];
}

// TODO: move to attachment
export interface Attachment {
  id?: string;
  name: string;
  size: number;
  contentType: string;
  thumbnail?: boolean;
}

// TODO: move to common
export class OccamError extends Error {
  constructor(error: Partial<OccamError> | string) {
    if (isString(error)) {
      error = { message: error, unexpected: false };
    }
    super(error.message);
    Object.assign(this, error);
  }
  name: string;
  level?: 'error' | 'warning' | 'info';
  statusCode?: number;
  message: string;
  unexpected = true;
  detail?: any;
  data?: any;
  stack?: string;
  cause?: Error;
}

export function isOccamError(error: any): error is OccamError {
  return error && (error.constructor.name == 'OccamError' || error.type == 'OccamError');
}
