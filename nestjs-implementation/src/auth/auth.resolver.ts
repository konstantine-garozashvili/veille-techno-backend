import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
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
}