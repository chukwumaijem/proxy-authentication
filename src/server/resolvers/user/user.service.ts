import { getConnection } from 'typeorm';
import { User } from '../../entities';
import { UserArgsType } from '../../types';

export class UserService {
  private connection = getConnection();
  private userRepository = this.connection.getRepository(User);

  async addUser(userData: UserArgsType): Promise<User> {
    try {
      const user = this.userRepository.create({ ...userData });

      return this.userRepository.save(user);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUser(userId: number): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOne(userId);

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const users = await this.userRepository.find();

      return users;
    } catch (error) {
      throw new Error(error);
    }
  }
}
