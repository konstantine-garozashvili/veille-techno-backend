import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { TokenBlacklistService } from './token-blacklist.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {}

  @Mutation(() => String, { description: 'Register a new user and return a JWT access token' })
  async register(@Args('input') input: CreateUserDto): Promise<string> {
    await this.usersService.create(input);
    const { access_token } = await this.authService.login(input.email, input.password);
    return access_token;
  }

  @Mutation(() => String, { description: 'Login and return a JWT access token' })
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<string> {
    const { access_token } = await this.authService.login(email, password);
    return access_token;
  }

  @Mutation(() => String, { description: 'Logout and invalidate JWT token' })
  @UseGuards(GqlAuthGuard)
  async logout(@Context() context: any): Promise<string> {
    const request = context.req;
    const authHeader = request.headers.authorization;
    const token = this.tokenBlacklistService.extractTokenFromHeader(authHeader);
    
    if (token) {
      this.tokenBlacklistService.blacklistToken(token);
    }
    
    return 'Successfully logged out';
  }
}