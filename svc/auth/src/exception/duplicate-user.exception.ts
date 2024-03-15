import { BaseException } from './base.exception';
import { Code } from '../code/code';

export class DuplicateUserException extends BaseException {
  public readonly code: number;
  public readonly message: string;
  public readonly detail: string | string[];
  public readonly stack?: string;

  constructor(detail?: string | string[], message?: string) {
    super();

    this.code = Code.CONFLICT.code;
    this.message = message || Code.CONFLICT.message;
    this.detail = detail;
  }
}
