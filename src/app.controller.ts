import {ClassSerializerInterceptor, Controller, Get, UseInterceptors, UsePipes, ValidationPipe} from '@nestjs/common';
import { AppService } from './app.service';
import {EventPattern, MessagePattern} from "@nestjs/microservices";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/love")
  @MessagePattern("hello")
  getHello(): string {
    console.log('Hello')
    return this.appService.getHello();
  }

  @EventPattern("hello-test")
  @UsePipes(ValidationPipe)
  testEvent(data: any): string {
    console.log('Data in Controller', data)
    return this.appService.getHello();
  }
}
