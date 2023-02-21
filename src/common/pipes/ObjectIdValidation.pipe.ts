import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!isValidObjectId(value)) {
      throw new BadRequestException('Incorrect id format');
    }
    return value;
  }
}
