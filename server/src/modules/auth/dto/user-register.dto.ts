import { OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { User } from 'src/modules/user/entities/user.entity';

export class UserRegister extends OmitType(User, ['password']) {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}
