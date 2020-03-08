import { Resolver, Arg, Query, Mutation, Args } from 'type-graphql';
import { User } from '../entities/User';
import { UserInputType } from './user.type';

@Resolver()
export class UserResolver {
  @Query()
  hello(@Arg('name') name: string): string {
    return `Hello, ${name}`;
  }

  @Mutation(() => User)
  addUser(@Args() userData: UserInputType): Promise<User> {
    try {
      const user = User.create({ ...userData });

      return user.save();
    } catch (error) {
      throw new Error(error);
    }
  }

  @Query(() => User)
  async getUser(@Arg('id') userId: string): Promise<User | undefined> {
    try {
      const user = await User.findOne(userId);

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  @Query(() => User)
  async getUsers(): Promise<User[]> {
    try {
      const users = await User.find();

      return users;
    } catch (error) {
      throw new Error(error);
    }
  }
}
