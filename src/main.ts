import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { SQSTransportStrategy } from './transport-strategies/SQSTransportStrategy';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>(
    {
      strategy: new SQSTransportStrategy(
        new URL('http://localhost:4566/000000000000/tester'),
        'test-event',
      ),
    },
    { inheritAppConfig: true },
  );
  await app.listen(3001);
  await app.startAllMicroservices();
}
bootstrap();
