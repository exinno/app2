import { Dict } from '..';
import { FormViewModel, Model, ModelType } from '.';
import { Field, View } from './model.decorator';

const databaseClients = [
  'pg',
  'pg-native',
  'sqlite3',
  'better-sqlite3',
  'mysql',
  'mysql2',
  'oracledb',
  'tedious',
  'mongo',
  'alasql',
  'model'
] as const;
export type DatabaseClient = typeof databaseClients[number];

/**
 * Datasource model
 */
@View({
  type: 'DataGridView',
  name: 'datasources',
  table: 'datasources',
  parent: 'models',
  columnFields: ['name', 'label', 'client', 'host', 'user', 'database'],
  detailView: <FormViewModel>{
    type: 'FormView',
    formFields: ['name', 'label', 'client', 'host', 'port', 'user', 'password', 'database', 'connection', 'options'],
    viewActions: ['submitForm', 'testConnect', 'openDbGate'],
    configure: ({ registry: { modelService }, data, model }) => {
      if (data?.name) {
        Object.assign(data, modelService.findByName(data.name, model.table as ModelType));
      }
    }
  },
  webActions: [
    {
      name: 'testConnect',
      label: 'Test Connect',
      icon: 'mdi-connection',
      actionType: 'single',
      execute: async ({ registry: { dataService, uiService }, selectedData: data }) => {
        const result = await dataService.testConnect(data);
        if (result === true) {
          uiService.notify({
            message: 'Connection successful.'
          });
        } else {
          uiService.notify({
            type: 'negative',
            message: result
          });
        }
        return result;
      }
    },
    {
      name: 'openDbGate',
      label: 'DB Explorer',
      icon: 'mdi-database-search',
      actionType: 'single',
      execute: async ({ registry: { appName, httpClient, uiService }, selectedData: data }) => {
        const result = await httpClient.post('containerService/startDbGate', data);
        if (!result) {
          uiService.notify({ message: 'DB Explorer startup failed!' });
          return;
        }
        let { hostname, protocol } = window.location;
        hostname = hostname.substring(hostname.indexOf('.') + 1);
        window.open(`${protocol}//${appName}-dbe.${hostname}`);
      }
    }
  ]
})
export class DatasourceModel extends Model {
  /** Type of database client ('pg', 'mongo', 'mysql' and etc.) will be using in an app.
   *  Recommend to use postgresql as features are firstly developed in postgresql. */
  @Field({
    type: 'SelectField',
    optionItems: databaseClients
  })
  client?: DatabaseClient;

  /** Defines host of the datasource. */
  @Field() host?: string;

  /** Defines port of the datasource. */
  @Field() port?: number;

  /** Defines user of the datasource. */
  @Field() user?: string;

  /** Defines password of the datasource*/
  @Field() password?: string;

  /** Defines database of the datasource*/
  @Field() database?: string;

  /** Defines information needed to connect to the database*/
  @Field({
    type: 'StringField',
    cols: 12
  })
  connection?: string;

  /** Defines options such as pool config(such as min and max pool). */
  @Field({
    type: 'PropField',
    propType: 'Dict',
    cols: 12,
    height: '200px'
  })
  options?: Dict;
}
