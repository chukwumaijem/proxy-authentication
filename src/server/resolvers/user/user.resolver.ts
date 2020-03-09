import { Resolver, Arg, Query, Mutation, Args } from 'type-graphql';
import { User } from '../../entities';
import { UserArgsType } from '../../types';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query()
  hello(@Arg('name') name: string): string {
    return `Hello, ${name}`;
  }

  @Mutation(() => User)
  addUser(@Args() userData: UserArgsType): Promise<User> {
    return this.userService.addUser(userData);
  }

  @Query(() => User)
  async getUser(@Arg('id') userId: number): Promise<User | undefined> {
    return this.userService.getUser(userId);
  }

  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }
}
