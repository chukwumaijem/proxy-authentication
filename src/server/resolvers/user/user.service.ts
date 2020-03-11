import { Service, Inject } from 'typedi';
import { User } from '../../entities';
import { UserArgsType } from '../../types';

@Service()
export class UserService {
  @Inject('UserEntity')
  private userModel = User;

  async addUser(userData: UserArgsType): Promise<User> {
    try {
      const user = this.userModel.create({ ...userData });

      return this.userModel.save(user);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUser(userId: number): Promise<User | undefined> {
    try {
      const user = await this.userModel.findOne(userId);

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const users = await this.userModel.find();

      return users;
    } catch (error) {
      throw new Error(error);
    }
  }
}
