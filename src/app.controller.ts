import {
  BadRequestException,
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { AuthGuard } from './guards/AuthorizationGuard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/api-test')
  @MessagePattern('hello')
  getHello(): string {
    console.log('Endpoint is working!!');
    return this.appService.getHello();
  }

  @Get('/api-test-error')
  @MessagePattern('hello')
  testError(): string {
    console.log('Endpoint is working!!');
    throw new BadRequestException('Order Number is Missing');
  }

  @EventPattern('test-event')
  @UseGuards(AuthGuard)
  testEvent(data: any): string {
    console.log('Data in Controller', data);
    return this.appService.getHello();
  }
}
