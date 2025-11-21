import { Request } from 'express';
import { MeResponseDto } from 'src/users/dto/user-response.dto';

export interface RequestWithUser extends Request {
  user: MeResponseDto;
}
