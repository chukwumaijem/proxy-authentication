import { Resolver, Arg, Query, Mutation, Args, Int } from 'type-graphql';
import { Service } from 'typedi';

import { User } from '../../entities';
import { UserArgsType } from '../../types';
import { UserService } from './user.service';

@Resolver()
@Service()
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
  async getUser(
    @Arg('userId', () => Int) userId: number
  ): Promise<User | undefined> {
    return this.userService.getUser(userId);
  }

  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }
}
