import { UserDto } from '../dto/user.dto';
import { User } from '../entity/user.entity';

export class UserMapper /*extends BaseMapper<UserDto, User>*/ {
  // public toEntity(userDto: UserDto): User {
  //   return this.mapToEntity(userDto, User);
  // }

  // public toDto(user: User): UserDto {
  //   return this.mapToDto(user, UserDto);
  // }

  public static toEntity(userDto: UserDto): User {
    const user = new User();

    user.id = userDto.id;
    user.email = userDto.email;
    user.password = userDto.password;

    return user;
  }

  public static toDto(user: User): UserDto {
    const userDto = new UserDto();

    userDto.email = user.email;

    return userDto;
  }
}
