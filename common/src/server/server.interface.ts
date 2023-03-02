import { ConfigModel } from '../model';

export interface ServerApp {
  modules: any[];
  bootstrap: (app: any, config: ConfigModel) => Promise<void>;
}
