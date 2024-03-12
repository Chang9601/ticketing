import { get } from 'env-var';

export class ServerEnv {
  public static readonly HOST = get('HOST').required().asString();
  public static readonly PORT = get('PORT').required().asPortNumber();
}
