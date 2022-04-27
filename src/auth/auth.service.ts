import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { compareSync } from 'bcrypt';
import { Users } from 'src/users/users.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: Users) {
    const payload = { sub: user.id, email: user.email };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersService.findOneOrFail({ where: { email } });

      const isPasswordValue = compareSync(password, user.password);
      if (!isPasswordValue) {
        return null;
      } else {
        return user;
      }
    } catch (error) {
      return null;
    }
  }
}
