import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async findOne(id: number) {
    const user = await this.userRepository
      .findOneOrFail({ where: { id } })
      .catch(() => {
        throw new NotFoundException('not found user with id: ' + id);
      });
    return user;
  }

  findOneByUsername(username: string) {
    return this.userRepository.findOne({
      where: { username },
      relations: ['national'],
    });
  }

  async remove(id: number) {
    const user = await this.userRepository
      .findOneOrFail({ where: { id } })
      .catch(() => {
        throw new NotFoundException('not found user with id: ' + id);
      });

    return this.userRepository.remove(user);
  }
}
