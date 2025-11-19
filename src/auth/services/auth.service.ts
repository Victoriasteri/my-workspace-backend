import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  UserLoginResponse,
  UserResponseDto,
} from 'src/users/dto/user-response.dto';
import { UserLoginDto } from 'src/users/dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(user: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepo.findOne({
      where: { email: user.email },
    });
    if (existingUser)
      throw new BadRequestException('user with this email already exists');

    const hashedPassword = await bcrypt.hash(user.password, 10);

    const userToSave = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      passwordHash: hashedPassword,
      role: user.role,
    };

    const createdUser = await this.userRepo.save(
      this.userRepo.create(userToSave),
    );

    const { passwordHash: _, ...safeUser } = createdUser;

    return safeUser;
  }

  async loginUser(userData: UserLoginDto): Promise<UserLoginResponse> {
    const existingUser = await this.userRepo.findOne({
      where: { email: userData.email },
    });

    if (!existingUser)
      throw new NotFoundException(
        `user with email ${userData.email} not found`,
      );

    const isValidPassword = await bcrypt.compare(
      userData.password,
      existingUser.passwordHash,
    );

    if (!isValidPassword) throw new UnauthorizedException('Invalid password');

    const payload = {
      sub: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
    };

    const access_token = await this.jwtService.signAsync(payload);

    const { passwordHash: _, ...safeUser } = existingUser;

    return {
      access_token,
      user: safeUser,
    };
  }
}
