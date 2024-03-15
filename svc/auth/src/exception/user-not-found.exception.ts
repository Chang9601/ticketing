import { BaseException } from './base.exception';
import { Code } from '../code/code';

export class UserNotFoundException extends BaseException {
  public readonly code: number;
  public readonly message: string;
  public readonly detail: string | string[];
  public readonly stack?: string;

  constructor(detail?: string | string[], message?: string) {
    super();

    this.code = Code.NOT_FOUND.code;
    this.message = message || Code.NOT_FOUND.message;
    this.detail = detail;
  }
}
