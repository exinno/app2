import { ConfigModel, registry, ServerApp } from 'app2-common';
import { NestExpressApplication } from '@nestjs/platform-express';
import HttpProxy from 'http-proxy';
import vhost from 'vhost';
import { Server } from 'http';
import { ContainerModule } from './container.module';
import { ContainerService } from './container.service';

const serverApp: ServerApp = {
  modules: [ContainerModule],
  bootstrap: async (app: NestExpressApplication, config: ConfigModel) => {
    // setup app, ide, dbe proxies
    const containerService = app.get(ContainerService);
    registry.register({ containerService });
    const proxy = new HttpProxy();
    const server: Server = app.getHttpServer();

    function getAppName(hostname: string) {
      let appName = hostname;
      if (hostname.includes('.')) appName = hostname.substring(0, hostname.indexOf('.'));
      if (appName.endsWith('-ide') || appName.endsWith('-dbe') || appName.endsWith('-dev'))
        appName = appName.substring(0, appName.lastIndexOf('-'));
      return appName;
    }

    server.on('upgrade', async (req, socket, head) => {
      let hostname = req.headers.host;
      if (hostname.includes(':')) hostname = hostname.substring(0, hostname.indexOf(':'));
      const appName = getAppName(hostname);
      const appRouter = await containerService.getProxyRouter(appName);
      const target = appRouter[hostname];
      proxy.ws(req, socket, head, { target });
    });

    app.use(
      vhost(`*.${config.containerDomain}`, async (req, res) => {
        const appName = getAppName(req.vhost[0]);
        try {
          const appRouter = await containerService.getProxyRouter(appName);
          const target = appRouter[req.vhost.hostname];
          if (target)
            proxy.web(req, res, { target, timeout: 5000 }, (err) => {
              res.status(500).send(err.message);
              throw err;
            });
          else res.status(404).send();
        } catch (err) {
          res.status(500).send(err.message);
          throw err;
        }
      })
    );
  }
};

export default serverApp;
