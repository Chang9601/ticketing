import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpExceptionBody,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';

import { ApiResponse } from '../api/api-response';
import { Code } from '../code/code';
import { BaseException } from '../exception/base.exception';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdpaterHost: HttpAdapterHost) {}

  public catch(exception: Error, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdpaterHost;

    const context = host.switchToHttp();
    const request: Request = context.getRequest();
    const response: Response = context.getResponse();

    const failure = this.handleException(exception);

    const log = `코드: ${failure.metadata.code}.\n메시지: ${failure.metadata.message}.\n경로: ${request.path}.\n타임스탬프: ${failure.metadata.timestamp}.`;

    console.log(log);
    console.log(failure.metadata.stack);

    failure.metadata.stack = null;

    httpAdapter.reply(response, failure, failure.metadata.code);
  }

  private handleException(exception: Error): ApiResponse<unknown> {
    if (exception instanceof HttpException) {
      const response = exception.getResponse() as HttpExceptionBody;

      // NestJS의 HttpException 클래스의 message 필드를 수정한다.
      exception.message = Code.toMessage[exception.getStatus()];

      return ApiResponse.handleFailure(
        exception.getStatus(),
        exception.message,
        response.message,
        exception.stack,
      );
    }

    if (exception instanceof BaseException) {
      return ApiResponse.handleFailure(
        exception.code,
        exception.message,
        exception.details,
        exception.stack,
      );
    }

    return ApiResponse.handleFailure(
      Code.INTERNAL_SERVER_ERROR.code,
      Code.INTERNAL_SERVER_ERROR.message,
      exception.stack,
    );
  }
}
