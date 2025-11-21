import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import {
  MeResponseDto,
  UserLoginResponse,
  UserResponseDto,
} from 'src/users/dto/user-response.dto';
import { UserLoginDto } from 'src/users/dto/user-login.dto';
import { Public } from '../decorators/public.decorator';
import type { RequestWithUser } from '../types/request-with-user.type';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/register')
  @ApiOperation({ summary: 'User authentication' })
  async registerNewUser(@Body() user: CreateUserDto): Promise<UserResponseDto> {
    return await this.authService.createUser(user);
  }

  @Public()
  @Post('/login')
  @ApiOperation({ summary: 'User login' })
  async loginUser(
    @Body() userData: UserLoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<UserLoginResponse, 'access_token'>> {
    const { access_token, user } = await this.authService.loginUser(userData);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { user };
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully logged out',
  })
  async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { message: 'Logged out successfully' };
  }

  @Get('/me')
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current authenticated user information',
    type: MeResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async getMe(@Req() req: RequestWithUser): Promise<MeResponseDto> {
    return req.user;
  }
}
