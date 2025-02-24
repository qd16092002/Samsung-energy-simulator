import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type IUserInfoParam = {
  id: number;
  username: string;
  nationalId: number;
};

export const UserInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IUserInfoParam => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
