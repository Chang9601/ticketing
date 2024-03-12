import { get } from 'env-var';

export class DatabaseEnv {
  public static readonly DB_TYPE = 'mysql';
  public static readonly DB_HOST = get('DB_HOST').required().asString();
  public static readonly DB_PORT = get('DB_PORT').required().asPortNumber();
  public static readonly DB_DATABASE = get('DB_NAME').required().asString();
  public static readonly DB_USERNAME = get('DB_USERNAME').required().asString();
  public static readonly DB_PASSWORD = get('DB_PASSWORD').required().asString();
}
