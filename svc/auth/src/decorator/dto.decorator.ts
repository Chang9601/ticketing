import { applyDecorators } from '@nestjs/common';

export function EmailValidator(options: any): PropertyDecorator {
  const defaults = [];

  return applyDecorators(...defaults);
}

export function PasswordValidator(optoins: any): PropertyDecorator {
  const defaults = [];

  return applyDecorators(...defaults);
}
