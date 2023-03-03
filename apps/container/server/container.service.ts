import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  Context,
  DataService,
  formatString,
  Dict,
  OccamError,
  registry,
  DatasourceModel,
  DatabaseClient
} from 'app2-common';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { randomUUID } from 'crypto';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { App } from '../model/common/views/apps';
import { Cacheable, CacheClear } from '@type-cacheable/core';

const hostname = os.hostname();

@Injectable()
export class ContainerService implements OnModuleInit {
  private dataService: DataService;

  onModuleInit() {
    this.dataService = registry.dataService;
    this.updateAppsStopped();
  }

  private updateAppsStopped() {
    // run without await for performance
    void this.dataService.update({
      view: 'apps',
      data: { status: 'stopped', ideStatus: 'stopped', pid: null, idePid: null },
      filter: { field: 'host', value: hostname },
      withoutTx: true,
      skipAcl: true,
      skipActivity: true
    });
  }

  @Cacheable({ cacheKey: (args) => `proxyRouter/${args[0]}.${registry.config.containerDomain}/${hostname}` })
  async getProxyRouter(appName: string) {
    const { config } = registry;
    const app = await this.dataService.get({ view: 'apps', select: ['name', 'host', 'port'], dataId: appName });
    if (!app?.host) return {};
    const proxyRouter = {};
    proxyRouter[`${app.name}.${config.containerDomain}`] = `http://${app.host}:${app.port}`;
    proxyRouter[`${app.name}-ide.${config.containerDomain}`] = `http://127.0.0.1:${app.port + 10000}`;
    proxyRouter[`${app.name}-dbe.${config.containerDomain}`] = `http://${app.host}:${app.port + 20000}`;
    proxyRouter[`${app.name}-dev.${config.containerDomain}`] = `http://${app.host}:${9000}`;
    return proxyRouter;
  }

  @CacheClear({ cacheKey: (args) => `proxyRouter/${args[0]}.${registry.config.containerDomain}/${hostname}` })
  clearProxyRouter(appName: string) {
    //
  }

  private async getApp(appName: string, context: Context) {
    return await this.dataService.get<App>({ view: 'apps', dataId: appName, context });
  }

  async mergeConfig(app: App) {
    try {
      const modelLoader: any = registry.resolve('modelLoader');
      const config = await modelLoader.getSingleModel('config', app.name);
      Object.assign(app, config);
    } catch (error) {
      console.warn(error);
    }
  }

  async createApp(app: App) {
    // copy template
    const template = app.template ?? 'empty';
    const templatePath = '../templates/' + template;
    if (!(await fs.pathExists(templatePath))) throw new OccamError(`There is no template ${template}.`);
    const appPath = '../apps/' + app.name;
    await fs.copy(templatePath, appPath);

    const allFiles = await this.readdirFiles(appPath);
    for (const file of allFiles) if (file.endsWith('.template')) await this.evalTemplate(file, app);

    // create database and user
    let sql = `CREATE USER "${app.name}" WITH ENCRYPTED PASSWORD '${app.password}'`;
    await this.dataService.executeSql({ sql, withoutTx: true });

    sql = `CREATE DATABASE "${app.name}" TEMPLATE template0 LC_COLLATE 'C' OWNER "${app.name}"`;
    await this.dataService.executeSql({ sql, withoutTx: true });

    // await this.startApp(app.name, context);
  }

  async removeApp(appName: string, context?: Context) {
    const appPath = '../apps/' + appName;
    await fs.remove(appPath);

    let sql = `DROP DATABASE "${appName}"`;
    await this.dataService.executeSql({ sql, context, withoutTx: true });

    sql = `DROP USER "${appName}"`;
    await this.dataService.executeSql({ sql, context, withoutTx: true });
  }

  async startApp(appName: string, context?: Context): Promise<void> {
    const child = spawn('node', [
      '-r',
      'ts-node/register',
      '-r',
      'tsconfig-paths/register',
      process.env.APP2_ENV == 'production' ? 'dist/main.js' : 'src/main.ts',
      appName
    ]);
    child.stdout.on('data', async (buffer: Buffer) => {
      const msg = buffer.toString().trim();
      console.log(appName, msg);
      if (msg.includes('application is running on:')) {
        const data: Partial<App> = { status: 'running' };
        await this.dataService.update({ view: 'apps', dataId: appName, data, context, withoutTx: true });
      }
    });
    child.stderr.on('data', async (buffer: Buffer) => {
      const msg = buffer.toString().trim();
      console.error(appName, msg);
    });
    child.on('exit', async () => {
      const data: Partial<App> = { stopTime: new Date(), status: 'stopped', pid: null };
      await this.dataService.update({ view: 'apps', dataId: appName, data, context, withoutTx: true });
    });
    return new Promise((resolve) => {
      child.on('spawn', async () => {
        const data: Partial<App> = { host: os.hostname(), pid: child.pid, startTime: new Date(), status: 'starting' };
        await this.dataService.update({ view: 'apps', dataId: appName, data, context, withoutTx: true });
        resolve();
      });
    });
  }

  async stopApp(appName: string, context?: Context): Promise<boolean> {
    const app = await this.getApp(appName, context);
    return this.killProcess(app.pid);
  }

  async startIde(appName: string, context?: Context): Promise<boolean> {
    const app = await this.getApp(appName, context);
    const child = spawn(
      'node',
      [
        './src-gen/backend/main.js',
        '--plugins=local-dir:plugins',
        '--hostname',
        '0.0.0.0',
        '--port',
        (app.port + 10000).toString(),
        '../apps/' + appName
      ],
      { cwd: '../theia' }
    );

    return await new Promise((resolve) => {
      child.stderr.on('data', (data) => console.error('theia', data.toString().trim()));
      child.stdout.on('data', (data) => console.log('theia', data.toString().trim()));
      child.on('spawn', async () => {
        const data: Partial<App> = { ideStatus: 'starting', idePid: child.pid };
        await this.dataService.update({ view: 'apps', dataId: appName, data, context, withoutTx: true });
      });
      child.on('exit', async () => {
        const data: Partial<App> = { ideStatus: 'stopped', idePid: null };
        await this.dataService.update({ view: 'apps', dataId: appName, data, context, withoutTx: true });
        resolve(false);
      });
      child.stdout.on('data', async (buffer: Buffer) => {
        const msg = buffer.toString().trim();
        if (msg.includes('Theia app listening on')) {
          resolve(true);
          const data: Partial<App> = { ideStatus: 'running' };
          await this.dataService.update({ view: 'apps', dataId: appName, data, context, withoutTx: true });
        }
      });
    });
  }

  async stopIde(appName: string, context?: Context): Promise<boolean> {
    const app = await this.getApp(appName, context);
    return this.killProcess(app.idePid);
  }

  private dbGateProcess: ChildProcessWithoutNullStreams;
  async startDbGate(datasource: DatasourceModel): Promise<boolean> {
    const engines: Record<DatabaseClient, string> = {
      pg: 'postgres@dbgate-plugin-postgres',
      'pg-native': 'postgres@dbgate-plugin-postgres',
      sqlite3: 'postgres@dbgate-plugin-sqlite',
      'better-sqlite3': 'postgres@dbgate-plugin-sqlite',
      mysql: 'postgres@dbgate-plugin-mysql',
      mysql2: 'postgres@dbgate-plugin-mysql',
      oracledb: undefined,
      tedious: 'postgres@dbgate-plugin-mssql',
      mongo: 'postgres@dbgate-plugin-mongo',
      alasql: undefined,
      model: undefined
    };
    const { appName, modelService } = registry;
    const workspace = `../apps/${appName}/.dbgate`;
    const engine = engines[datasource.client];
    if (!fs.pathExistsSync(workspace)) await fs.mkdir(workspace);
    await fs.remove(workspace + '/jsl');
    await fs.remove(workspace + '/run');
    if (!engine) throw new OccamError(`${datasource.client} is not supported`);
    const connection: Dict = {
      _id: randomUUID(),
      engine,
      singleDatabase: true,
      defaultDatabase:
        datasource.database ?? datasource.connection.substring(datasource.connection.lastIndexOf('/') + 1)
    };
    if (datasource.host) {
      Object.assign(connection, {
        server: datasource.host,
        user: datasource.user,
        password: datasource.password,
        passwordMode: 'saveRaw'
      });
    } else {
      Object.assign(connection, {
        useDatabaseUrl: '1',
        databaseUrl: datasource.connection
      });
    }
    await fs.writeFile(workspace + '/connections.jsonl', JSON.stringify(connection));
    const port = modelService.config.port + 20000;
    if (this.dbGateProcess) this.dbGateProcess.kill();
    const child = (this.dbGateProcess = spawn('node', ['start', port.toString(), workspace], {
      cwd: '../dbgate'
    }));

    return await new Promise((resolve) => {
      child.on('spawn', () => console.error('dbgate', 'spawn'));
      child.on('exit', () => {
        console.error('dbgate', 'exit');
        resolve(false);
      });
      child.stderr.on('data', (buffer) => console.error('dbgate', buffer.toString().trim()));
      child.stdout.on('data', (buffer) => {
        const msg = buffer.toString().trim();
        console.log('dbgate', buffer.toString().trim());
        if (msg.includes('DbGate API listening on port')) {
          resolve(true);
        }
      });
    });
  }

  private killProcess(pid: number): boolean {
    if (!pid) return false;
    try {
      process.kill(pid);
      return true;
    } catch (error) {
      if (error.code == 'ESRCH') return false;
      else throw error;
    }
  }

  private async evalTemplate(templatePath: string, app: App) {
    const content = await fs.readFile(templatePath);
    const contentToWrite = formatString(content.toString(), app);
    await fs.writeFile(templatePath.replace(/.template$/, ''), contentToWrite);
    await fs.remove(templatePath);
  }

  private async readdirFiles(pathStr: string): Promise<string[]> {
    const allFiles: string[] = [];
    const files = await fs.readdir(pathStr, { withFileTypes: true });

    for (const file of files) {
      if (file.isDirectory()) {
        const subFiles = await this.readdirFiles(pathStr + path.sep + file.name);
        allFiles.push(...subFiles);
      } else {
        allFiles.push(pathStr + path.sep + file.name);
      }
    }
    return allFiles;
  }
}
