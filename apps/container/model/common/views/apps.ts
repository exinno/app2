import { asArray, asSingle, ConfigModel, Field, registry, View } from 'app2-common';
import { ContainerService } from '../../../server/container.service';

export const appStatuses = ['created', 'starting', 'running', 'stopped'] as const;
export type AppStatus = typeof appStatuses[number];

@View({
  name: 'apps',
  type: 'DataGridView',
  parent: 'config',
  dataId: null, // override config dataId '0'
  table: 'OcApp',
  datasource: 'default',
  acl: 'ownerAny',
  aclByRecord: true,
  ownerField: 'owner',
  keyField: 'name',
  labelField: 'title',
  updatedAtField: 'updatedAt',
  updatedByField: 'updatedBy',
  createdByField: 'owner',
  orderBy: [{ field: 'updatedAt', direction: 'desc' }],
  columnFields: ['name', 'title', 'owner', 'host', 'port', 'status', 'pid', 'ideStatus', 'idePid'],
  pageFields: ['status'],
  paramFields: ['status'],
  refreshOnFilterChange: true,
  fieldGroups: [
    {
      label: 'Basic information',
      groupFields: [
        'name',
        'title',
        'icon',
        'owner',
        'host',
        'port',
        'password',
        'template',
        'status',
        'pid',
        'ideStatus',
        'idePid',
        'description'
      ],
      defaultOpened: true
    }
  ],
  extraFieldGroup: {
    label: 'Config'
  },
  viewActions: [
    'startApp',
    'stopApp',
    'showAppLog',
    'openApp',
    'openIde',
    'stopIde',
    'openAdd',
    'openEdit',
    'openRemove',
    'refresh'
  ],
  live: true,
  async afterFind({ result }) {
    const containerService = registry.resolve<ContainerService>('containerService');
    for (const app of result.value) {
      await containerService.mergeConfig(app);
    }
  },
  async afterGet({ result }) {
    if (!result) return;
    const containerService = registry.resolve<ContainerService>('containerService');
    await containerService.mergeConfig(result);
  },
  async beforeCreate({ registry: { dataService }, data, context }) {
    for (const app of data as App[]) {
      const [{ port }] = await dataService.executeSql({ sql: 'select max(port) port from "OcApp"', context });
      app.port ??= port ? port + 1 : 3001;
      app.status = 'created';
    }
  },
  async afterCreate({ data, context }) {
    const containerService = registry.resolve<ContainerService>('containerService');
    for (const app of data) {
      await containerService.createApp(app, context);
      containerService.clearProxyRouter(app.name);
    }
  },
  async afterUpdate({ registry: { _ }, data, dataId }) {
    // After the Apps update, the properties of the ConfigModel are reflected in the app's config.
    const typeService: any = registry.resolve('typeService');
    const properties = typeService.getType('ConfigModel').children.map((child) => child.name);
    const newConfig = _.pick(asSingle(data), properties);
    if (Object.keys(newConfig).length) {
      const modelLoader: any = registry.resolve('modelLoader');
      const config = await modelLoader.getSingleModel('config', dataId);
      Object.assign(config, newConfig);
      await modelLoader.saveSingleModel(config, 'config', dataId);
    }
    const containerService: ContainerService = registry.resolve('containerService');
    containerService.clearProxyRouter(dataId);
  },
  async beforeRemove({ dataId, context }) {
    const containerService: ContainerService = registry.resolve('containerService');
    for (const appName of asArray(dataId)) {
      await containerService.stopIde(appName, context);
      await containerService.stopApp(appName, context);
      containerService.clearProxyRouter(appName);
    }
  },
  async afterRemove({ dataId, context }) {
    const containerService: ContainerService = registry.resolve('containerService');
    for (const appName of asArray(dataId)) await containerService.removeApp(appName, context);
  },
  serverActions: [
    {
      name: 'startApp',
      icon: 'mdi-play',
      actionType: 'single',
      async execute({ dataId, context }) {
        const containerService: ContainerService = registry.resolve('containerService');
        await containerService.startApp(dataId, context);
        containerService.clearProxyRouter(dataId);
      },
      disabled: ({ selectedData }) => selectedData.status != 'stopped'
    },
    {
      name: 'stopApp',
      icon: 'mdi-stop',
      actionType: 'single',
      async execute({ dataId, context }) {
        const containerService: ContainerService = registry.resolve('containerService');
        await containerService.stopApp(dataId, context);
        containerService.clearProxyRouter(dataId);
      },
      disabled: ({ selectedData }) => selectedData.status == 'stopped'
    },
    {
      name: 'startIde',
      icon: 'mdi-cog-play',
      actionType: 'single',
      async execute({ dataId, context }) {
        const containerService: ContainerService = registry.resolve('containerService');
        await containerService.startIde(dataId, context);
      },
      disabled: ({ selectedData }) => selectedData.ideStatus != 'stopped'
    },
    {
      name: 'stopIde',
      icon: 'mdi-cog-stop',
      actionType: 'single',
      async execute({ dataId, context }) {
        const containerService: ContainerService = registry.resolve('containerService');
        await containerService.stopIde(dataId, context);
      },
      disabled: ({ selectedData }) => selectedData.ideStatus == 'stopped'
    }
  ],
  webActions: [
    {
      name: 'startApp',
      icon: 'mdi-play',
      actionType: 'single',
      async execute({ registry: { dataService, modelService }, viewModel, selectedId, data }) {
        await dataService.executeAction({ view: 'apps', action: 'startApp', dataId: selectedId });
        await modelService.executeWebAction('showAppLog', {
          viewModel,
          dataId: selectedId as string,
          data,
          pageCtx: { nLines: 0 }
        });
      }
    },
    {
      name: 'showAppLog',
      label: 'App Log',
      icon: 'mdi-text',
      actionType: 'single',
      async execute({ registry: { uiService }, selectedId, pageCtx, viewService }) {
        await uiService.openModal({ view: 'logs', parentView: viewService, dataId: selectedId, pageCtx });
      }
    },
    {
      name: 'openApp',
      icon: 'mdi-open-in-new',
      actionType: 'single',
      execute({ registry: { modelService }, data }) {
        const { protocol } = window.location;
        window.open(`${protocol}//${data.name}.${modelService.config.containerDomain}`);
      },
      disabled({ selectedData }) {
        return selectedData.status != 'running';
      }
    },
    {
      name: 'openIde',
      label: 'Open IDE',
      icon: 'mdi-code-braces',
      actionType: 'single',
      async execute({ registry: { dataService, modelService }, selectedData: data, dataId }) {
        if (data.ideStatus == 'stopped') await dataService.executeAction({ view: 'apps', action: 'startIde', dataId });
        const { protocol } = window.location;
        window.open(`${protocol}//${data.name}-ide.${modelService.config.containerDomain}`);
      }
    }
  ]
})
export class App extends ConfigModel {
  /** Unique Name of the app. */
  @Field({ label: 'Name (subdomain)', type: 'StringField', required: true, validators: ['subdomain'] })
  name?: string;

  /** Password of the app. It gets encrypted. */
  @Field({ type: 'StringField', updatable: false })
  password?: string;

  /** Predefined template for app. It uses 'empty' if not defined. */
  @Field({ type: 'StringField', updatable: false })
  template?: string;

  /** Host of the app. */
  @Field({ type: 'StringField', creatable: false, updatable: false })
  host?: string;

  /** Pid of the app.  */
  @Field({ type: 'NumberField', creatable: false, updatable: false })
  pid?: number;

  /** It shows status ('created', 'starting', 'running', 'stopped') of the app. */
  @Field({ type: 'SelectField', optionItems: appStatuses, creatable: false, updatable: false })
  status?: AppStatus;

  /** Pid of the IDE. */
  @Field({ type: 'NumberField', creatable: false, updatable: false })
  idePid?: number;

  /** It shows status ('created', 'starting', 'running', 'stopped') of the IDE. */
  @Field({ type: 'SelectField', optionItems: appStatuses, creatable: false, updatable: false })
  ideStatus?: AppStatus;

  /** It shows time app started. */
  @Field({ type: 'DateField', creatable: false, updatable: false })
  startTime?: Date;

  /** It shows time app ended. */
  @Field({ type: 'DateField', creatable: false, updatable: false })
  stopTime?: Date;

  /** It defines owner of the app.
   *  Owner of the app has all the permission regarding the app that owner owns. */
  @Field({ type: 'LookupField', relatedView: 'users', editable: false, creatable: false })
  owner?: any;

  /** 'updatedAt' identifies when was the app updated. */
  @Field({ type: 'DateField', dateType: 'dateTime', editable: false, creatable: false })
  updatedAt?: Date;

  /** 'updatedBy' identifies who created the app. */
  @Field({ type: 'LookupField', relatedView: 'users', editable: false, creatable: false })
  updatedBy?: any;

  /** Descriptions of the app. */
  @Field({ type: 'StringField', cols: 12 })
  declare description?: string;
}
