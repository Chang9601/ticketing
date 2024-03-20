import { BaseException } from './base.exception';
import { Code } from '../code/code';

export class InvalidCredentialException extends BaseException {
  public readonly code: number;
  public readonly message: string;
  public readonly details: string | string[];
  public readonly stack?: string;

  constructor(details?: string | string[], message?: string) {
    super();

    this.code = Code.BAD_REQUEST.code;
    this.message = message || Code.BAD_REQUEST.message;
    this.details = details;
  }
}
