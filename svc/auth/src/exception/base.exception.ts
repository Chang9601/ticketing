export abstract class BaseException extends Error {
  public abstract readonly statusCode: number;

  constructor(public readonly message: string) {
    super(message);
  }

  abstract serializeErrors(): { message: string; statusCode: number }[];
}
