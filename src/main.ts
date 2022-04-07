import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {SQSServer} from "./transport-strategies/SQSServer";

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const microService =  app.connectMicroservice<MicroserviceOptions>( {
    /*transport: Transport.TCP,
    options:{
      host: 'localhost',
      port: 3000
    }*/
    strategy: new SQSServer()
  }, {inheritAppConfig: true});
  await app.listen(3001);
  await app.startAllMicroservices()
}
bootstrap();
