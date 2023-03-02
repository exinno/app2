import * as common from '.';
import { HttpClient, httpClient, NotificationService } from '.';
import { dayjs } from './common';
import { detect } from 'detect-browser';
import _ from 'lodash';
import { AclService, AuthService } from './auth';
import { MessagingService } from './messaging';
import { DataService, Dict, EncryptionService } from './data';
import { ConfigModel, MessageService, ModelService, StorageClient, ViewService } from './model';
import { BookmarkService, NavigationService, RouteLocation, UiService } from './ui';

const envInfo = detect();

export class Registry {
  [k: string]: any;

  private readonly store: any = globalThis.$registry?.store ?? {};

  resolve<T>(name: string): T {
    return this.store[name];
  }

  register(services: Dict): void {
    Object.assign(this.store, services);
  }

  get modelService(): ModelService {
    return this.resolve('modelService');
  }

  get dataService(): DataService {
    return this.resolve('dataService');
  }

  get uiService(): UiService {
    return this.resolve('uiService');
  }

  get authService(): AuthService {
    return this.resolve('authService');
  }

  get messagingService(): MessagingService {
    return this.resolve('messagingService');
  }

  get notificationService(): NotificationService {
    return this.resolve('notificationService');
  }

  get aclService(): AclService {
    return this.resolve('aclService');
  }

  get encryptionService(): EncryptionService {
    return this.resolve('encryptionService');
  }

  get messageService(): MessageService {
    return this.resolve('messageService');
  }

  get navigationService(): NavigationService {
    return this.resolve('navigationService');
  }

  get bookmarkService(): BookmarkService {
    return this.resolve('bookmarkService');
  }

  get storageClient(): StorageClient {
    return this.resolve('storageClient');
  }

  get dayjs(): typeof dayjs {
    return this.resolve('dayjs');
  }

  get t(): typeof this.messageService.t {
    return this.messageService.t.bind(this.messageService);
  }

  get appName(): string {
    return this.resolve('appName') ?? this.modelService.model.appName;
  }

  get env(): string {
    return this.resolve('env') ?? this.modelService.model.env;
  }

  get config(): ConfigModel {
    return this.resolve('config') ?? this.modelService.config;
  }

  private _appCtx;

  get appCtx(): Dict {
    this._appCtx ??= this.reactive({});
    return this._appCtx;
  }

  get envInfo() {
    return envInfo;
  }

  get $q(): any {
    return this.resolve('$q');
  }

  get route(): RouteLocation {
    return this.resolve('route');
  }

  get reactive(): (any) => any {
    return this.resolve('reactive');
  }

  get common() {
    return common;
  }

  get httpClient(): HttpClient {
    return httpClient;
  }

  get _() {
    return _;
  }

  get callProp() {
    return this.modelService.callProp;
  }

  createService = <T extends object>(ServiceClass: new (...args: any[]) => T, ...args: any[]): T => {
    return this.store.createService(ServiceClass, ...args);
  };
}

export const registry = new Proxy(new Registry(), {
  get(target, property: string) {
    if (target[property]) return target[property];
    else return target.resolve(property);
  }
});

declare global {
  var $registry: Registry;
  var $mainView: ViewService;
  var $execute: (...args: any[]) => any;
}

globalThis.$registry ??= registry;
