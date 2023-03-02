import { ConfigModel, ServerApp } from 'app2-common';
import { NestExpressApplication } from '@nestjs/platform-express';

const serverApp: ServerApp = {
  modules: [],
  async bootstrap(app: NestExpressApplication, config: ConfigModel) {
    //
  }
};

export default serverApp;
