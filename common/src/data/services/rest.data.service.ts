import {
  asArray,
  asSingle,
  DatasourceModel,
  FieldModel,
  httpClient,
  jsSerializer,
  ChangeItem,
  SubscribeOptions,
  simplifyDataToId,
  registry,
  randomString,
  isString,
  replaceObject,
  removeStartsWith
} from '../..';
import { SubscriptionLike } from 'rxjs';
import { ActionOptions, DataOptions, DataService, Dict, FindOptions, FindResult, SaveOptions } from '..';
import _ from 'lodash';

export class RestDataService extends DataService {
  private readonly DATA_API_URL: string = 'api/data';

  private toParams(options: FindOptions) {
    const params: any = {};
    if (options.filter) {
      params.filter = options.filter;
    }
    if (options.params) {
      params.params = isString(options.params)
        ? options.params
        : JSON.stringify(simplifyDataToId(options.params, true));
    }
    if (options.$orderby) {
      params.$orderby = options.$orderby;
    }
    if (options.skip) {
      params.$skip = options.skip;
    }
    if (options.top) {
      params.$top = options.top;
    }
    if (options.select) {
      params.select = isString(options.select) ? options.select : JSON.stringify(options.select);
    }
    if (options.count) {
      params.$count = options.count;
    }
    if (options.groupBy) {
      params.groupBy = options.groupBy;
    }
    if (options.orderBy) {
      params.orderBy = options.orderBy;
    }
    if (options.dataId) {
      params.dataId = options.dataId;
    }
    if (options.live) {
      params.live = options.live;
    }

    return params;
  }

  toSaveParams(options: SaveOptions) {
    const params: any = this.toParams(options);

    if (options.skipUpdateAtUpdate) {
      params.skipUpdateAtUpdate = options.skipUpdateAtUpdate;
    }
    return params;
  }

  preSaveData({ data, serializer }: DataOptions) {
    // Model data는 처리하지 않음
    if (asSingle(data, true)?.$configureProxy) return data;
    const preData = simplifyDataToId(data, true);
    removeStartsWith(preData, '$');

    return serializer == 'js' ? { $serialized: jsSerializer.serialize(preData) } : preData;
  }

  async find<T = Dict>(options: FindOptions): Promise<FindResult<T>> {
    if (options.live) {
      const { reactive } = registry;
      const result: FindResult<T> = reactive({ value: [] });
      return new Promise(async (resolve) => {
        result.subscription = await this.subscribe(options, { resultData: result.value });
        resolve(result);
      });
    } else {
      const result = await httpClient.request<FindResult<T>>({
        method: 'get',
        url: `${this.DATA_API_URL}/${options.view}`,
        params: this.toParams(options)
      });

      result.value = this.applyComputed(result.value, options.view);
      result.count ??= result['@odata.count'];
      return result;
    }
  }

  async getAll<T = Dict>(options: FindOptions): Promise<T[]> {
    const result = await this.find<T>(options);

    return result.value;
  }

  async count(options: FindOptions<any>): Promise<number> {
    const result = await httpClient.request<number>({
      method: 'get',
      url: `${this.DATA_API_URL}/${options.view}/$count`,
      params: this.toParams(options)
    });

    return result;
  }

  async subscribe(options: FindOptions, subscribeOptions?: SubscribeOptions): Promise<SubscriptionLike> {
    const { notificationService } = registry;
    const subscribeId = randomString();

    console.debug('subscribe', options.view, subscribeId);

    notificationService.addListener({
      type: 'dataChanged',
      subscribeId,
      execute: (notifyItem) => {
        const changeItem: ChangeItem = notifyItem.message;
        subscribeOptions.next?.(changeItem);
        if (subscribeOptions.resultData) {
          const { resultData } = subscribeOptions;
          if (changeItem.changeType === 'initial') {
            resultData.push(...changeItem.data);
          } else if (changeItem.changeType === 'create') {
            for (const data of changeItem.data) {
              if (options.livePrepend) resultData.unshift(data);
              else resultData.push(data);
            }
          } else if (changeItem.changeType === 'update') {
            for (const data of changeItem.data) {
              const i = resultData.findIndex((item) => item.$id == data.$id);
              replaceObject(resultData[i], data);
            }
          } else if (changeItem.changeType === 'remove') {
            for (const dataId of changeItem.dataId) {
              const i = resultData.findIndex((item) => item.$id == dataId);
              resultData.splice(i, 1);
            }
          }
        }
      }
    });

    await httpClient.request({
      url: `api/notification/${notificationService.instanceId}/${options.view}/${subscribeId}`,
      method: 'get',
      params: this.toParams(options)
    });

    const subscription: SubscriptionLike = {
      closed: false,
      unsubscribe() {
        console.debug('unsubscribe', subscribeId);
        void httpClient.request({
          url: `api/notification/${notificationService.instanceId}/${options.view}/${subscribeId}`,
          method: 'delete'
        });
        this.closed = true;
      }
    };
    return subscription;
  }

  async get(options: FindOptions): Promise<any> {
    let data = await httpClient.request({
      method: 'get',
      url: `${this.DATA_API_URL}/${options.view}('${asSingle(options.dataId)}')`,
      params: this.toParams(options)
    });
    if (options.serializer == 'js' && isString(data)) data = jsSerializer.deserialize(data);

    if (data) return this.applyComputed(data, options.view);
    else return undefined;
  }

  async save(options: SaveOptions): Promise<number> {
    const data = this.preSaveData(options);
    const result = await httpClient.request({
      method: 'put',
      url: `${this.DATA_API_URL}/${options.view}`,
      params: this.toSaveParams(options),
      data
    });

    return result;
  }

  async create(options: SaveOptions): Promise<number> {
    const data = this.preSaveData(options);
    const result = await httpClient.request({
      method: 'post',
      url: `${this.DATA_API_URL}/${options.view}`,
      params: this.toParams(options),
      data
    });

    return result;
  }

  async update(options: SaveOptions): Promise<number> {
    const data = this.preSaveData(options);
    const result = await httpClient.request({
      method: 'patch',
      url: `${this.DATA_API_URL}/${options.view}('${asSingle(options.dataId)}')`,
      params: this.toSaveParams(options),
      data
    });

    return result;
  }

  async remove(options: SaveOptions): Promise<number> {
    const dataId = asArray(options.dataId);

    if (dataId && dataId.length == 1 && typeof dataId[0] != 'object') {
      return await httpClient.request({
        url: `${this.DATA_API_URL}/${options.view}('${dataId}')`,
        method: 'delete',
        params: this.toParams(options)
      });
    } else {
      return await httpClient.request({
        url: `${this.DATA_API_URL}/${options.view}`,
        method: 'delete',
        params: this.toParams(_.omit(options, 'dataId')),
        data: dataId
      });
    }
  }

  getTables(options: FindOptions): Promise<Dict[]> {
    return httpClient.request({ serviceName: 'data/getTables', params: options });
  }

  getFieldsByTable(options: FindOptions): Promise<FieldModel[]> {
    return httpClient.request({ serviceName: 'data/getFieldsByTable', params: options });
  }

  testConnect(datasource: DatasourceModel): Promise<true | string> {
    return httpClient.post('data/testConnect', datasource);
  }

  async executeAction(options: ActionOptions): Promise<any> {
    let serviceName = 'data/' + (options.view ? options.view + '/' + options.action : options.action);
    if (options.dataId) serviceName = `data/${options.view}('${asSingle(options.dataId)}')/${options.action}`;

    // TODO: pass pageCtx, multiple dataId
    return httpClient.request({
      serviceName,
      method: 'post',
      params: this.toSaveParams(options),
      data: options.data
    });
  }

  loadCsv(): Promise<number> {
    throw new Error('Not supported.');
  }

  async executeSql(): Promise<any> {
    throw new Error('Not supported.');
  }

  async updateSchema(): Promise<void> {
    throw new Error('Not supported.');
  }
}
