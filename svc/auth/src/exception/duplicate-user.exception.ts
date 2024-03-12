import { HttpStatus } from '@nestjs/common';

import { BaseException } from './base.exception';

// export class DuplicateUserException extends HttpException {
//   constructor() {
//     super('이메일 사용 중.', HttpStatus.CONFLICT);
//   }
// }

export class DuplicateUserException extends BaseException {
  statusCode = HttpStatus.CONFLICT;

  constructor() {
    super('이메일 사용 중.');
  }

  serializeErrors() {
    return [{ message: this.message, statusCode: this.statusCode }];
  }
}
