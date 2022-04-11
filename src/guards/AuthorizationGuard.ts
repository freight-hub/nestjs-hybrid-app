import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToRpc();
    console.log('Received: ', context.getArgByIndex(0));
    const message = context.getArgByIndex(0).Messages[0];
    if (message.Body.id == undefined) {
      throw new BadRequestException('User ID is missing');
    }
    return true;
  }
}
