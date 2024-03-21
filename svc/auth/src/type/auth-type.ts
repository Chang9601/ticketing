import { Request } from 'express';

export type UserPayload = {
  id: number;
  email: string;
};

export type RequestWithUser = Request & { user: UserPayload };

export type TokenPayload = {
  id: number;
};
