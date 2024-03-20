import * as bcrypt from 'bcrypt';

export class Password {
  public static async hash(password: string): Promise<string> {
    const saltRounds = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
  }

  public static async compare(
    dtoPassword: string,
    entityPassword: string,
  ): Promise<boolean> {
    const passwordMatch = await bcrypt.compare(dtoPassword, entityPassword);

    return passwordMatch;
  }
}
