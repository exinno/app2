import { Global, Module } from '@nestjs/common';
import { ContainerController } from './container.controller';
import { ContainerService } from './container.service';

@Global()
@Module({
  providers: [ContainerService],
  controllers: [ContainerController]
})
export class ContainerModule {}
