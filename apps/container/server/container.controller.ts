import { Controller, Get, Req, Response, Sse } from '@nestjs/common';
import { registry } from 'app2-common';
import dayjs from 'dayjs';
import { Request } from 'express';
import fs from 'fs-extra';
import { Observable } from 'rxjs';
import { Tail } from 'tail';

@Controller('api')
export class ContainerController {
  @Get('logList/:appName?')
  async logList(@Req() request: Request) {
    const appName = request.params.appName ?? registry.appName;
    const files = await fs.readdir(`logs/${appName}`);
    return files.filter((filename) => !filename.startsWith('.'));
  }

  @Get('logs/:appName?/:logName?')
  async logs(@Req() request: Request, @Response({ passthrough: true }) response) {
    // TODO: security
    const logPath = this.getLogPath(request);
    if (fs.pathExistsSync(logPath)) {
      response.set({ 'Content-Type': 'text/plain' });
      const buffer = await fs.readFile(logPath);
      return buffer.toString();
    } else {
      response.status(404).send();
    }
  }

  @Sse('logs::live/:appName?/:logName?')
  logsLive(@Req() request: Request) {
    // TODO: security
    const logPath = this.getLogPath(request);
    const nLines = request.query.nLines ? parseInt(request.query.nLines as string) : undefined;
    const tail = new Tail(logPath, { nLines });

    return new Observable<MessageEvent>((subscriber) => {
      tail.on('line', (line) => subscriber.next({ data: line } as MessageEvent));
      const interval = setInterval(() => fs.stat(logPath), 500);

      return () => {
        clearInterval(interval);
        tail.unwatch();
      };
    });
  }

  private getLogPath(request: Request) {
    const { params } = request;
    const appName = params.appName ?? registry.appName;
    const logPath = `logs/${appName}/${request.params.logName ?? dayjs().format('YYYY-MM-DD') + '.log'}`;
    if (!fs.existsSync(logPath)) fs.closeSync(fs.openSync(logPath, 'w'));
    return logPath;
  }
}
