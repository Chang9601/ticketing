import { applyDecorators } from '@nestjs/common';
import { IsEmail } from 'class-validator';

export function EmailValidator(): PropertyDecorator {
  const defaults = [IsEmail({}, { message: 'sfs' })];

  return applyDecorators(...defaults);
}

export function PasswordValidator(): PropertyDecorator {
  const defaults = [];

  return applyDecorators(...defaults);
}
