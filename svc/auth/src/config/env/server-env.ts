//import { get } from 'env-var';

export class ServerEnv {
  public static readonly HOST = 'localhost'; //get('HOST').required().asString();
  public static readonly PORT = 3000; //get('PORT').required().asPortNumber();
  public static readonly ACCESS_TOKEN_SECRET = 'sfafsa'; // get('ACCESS_TOKEN_SECRET).asString();
  public static readonly ACCESS_TOKEN_EXPIRATION = 3600; // get('ACCESS_TOKEN_EXPIRATION').required().asNumber();
}
