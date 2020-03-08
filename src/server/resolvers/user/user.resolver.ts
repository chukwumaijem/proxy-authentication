import { Resolver, Arg, Query, Mutation, Args, Int } from 'type-graphql';
import { User } from '../../entities';
import { UserArgsType } from '../../types';

@Resolver()
export class UserResolver {
  @Query()
  hello(@Arg('name') name: string): string {
    return `Hello, ${name}`;
  }

  @Mutation(() => User)
  addUser(@Args() userData: UserArgsType): Promise<User> {
    try {
      const user = User.create({ ...userData }).save();

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  @Query(() => User)
  async getUser(
    @Arg('userId', () => Int) userId: number
  ): Promise<User | undefined> {
    try {
      const user = await User.findOne(userId);

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    try {
      const users = await User.find();

      return users;
    } catch (error) {
      throw new Error(error);
    }
  }
}
