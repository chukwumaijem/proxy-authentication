import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validateOrReject } from 'class-validator';
import { compareSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import envs from '../../../config/app';
import { AccountUserEntity } from '../entities/account-user.entity';
import { LoginDto, ChangePasswordDto } from '../dto';
import { ICurrentUser, IUser } from '../../../common/interfaces';
import { DEFAULT_USER } from '../constants';
import { responseHandler } from '../../../common/utils';

@Injectable()
export class AccountUserService {
  constructor(
    @InjectRepository(AccountUserEntity)
    private accountUserRepo: Repository<AccountUserEntity>,
  ) {}

  private generatePassword(): string {
    const sliceNumber = Math.floor(Math.random() * 5) + 10;
    return Buffer.from(Math.random().toString())
      .toString('base64')
      .slice(sliceNumber);
  }

  private verifyPassword(received: string, saved: string): boolean {
    return compareSync(received, saved);
  }

  private generateToken(email: string): string {
    return sign({ email }, envs.authSecret, { expiresIn: '7d' });
  }

  private async findUserByEmail(email: string): Promise<IUser | null> {
    const response = await this.accountUserRepo.findOne({ email });

    if (response.invitedBy !== DEFAULT_USER) {
      const addedBy = await this.accountUserRepo.findOne({ email });
      return {
        ...response,
        invitedBy: {
          email: addedBy.email,
          firstName: addedBy.firstName,
          lastName: addedBy.lastName,
        },
      };
    }

    return response;
  }

  async createDefaultAccount(): Promise<void> {
    const { defaultAccountEmail } = envs;
    if (!defaultAccountEmail) {
      throw new Error('No Account users found. A DEFAULT_ACCOUNT_EMAIL is required to generate one.');
    } else {
      this.createAccountUser(defaultAccountEmail, DEFAULT_USER);
    }
  }

  async countAccountUsers(): Promise<Number> {
    const [_, accountUsersCount] = await this.accountUserRepo.findAndCount();
    return accountUsersCount;
  }

  sendInvitation(data) {
    // Todo: Move this method to notification module.
    console.log('Default User Credntials: \t', JSON.stringify(data, null, 2));
  }

  async createAccountUser(email: string, invitedBy: string) {
    try {
      const userData = { email, password: this.generatePassword(), invitedBy };
      const user = this.accountUserRepo.create(userData);
      await validateOrReject(user);
      user.save();
      this.sendInvitation(user);
    } catch (error) {
      throw new Error(`Could not create default user: ${error}`);
    }
  }

  async accountUserlogin({ email, password }: LoginDto) {
    const user = await this.findUserByEmail(email);

    if (!this.verifyPassword(password, user.password)) {
      return responseHandler(false, 'Login error. Try again.');
    }

    return responseHandler(true, 'Login Success.', { token: this.generateToken(user.email), user });
  }

  async changePassword(data: ChangePasswordDto, currentUser: ICurrentUser) {
    const user = await this.accountUserRepo.findOne({ email: currentUser.email });

    if (!user || !this.verifyPassword(data.currentPassword, user.password)) {
      return responseHandler(false, 'Could not change user password');
    }

    user.password = data.newPassword;
    user.defaultPasswordChanged = true;
    user.save();

    return responseHandler(true, 'Password changed successfully', { token: this.generateToken(user.email) });
  }

  async addAccountUser(email: string, currentUser: ICurrentUser) {
    const user = await this.accountUserRepo.findOne({ email: currentUser.email });

    try {
      await this.createAccountUser(email, user.id);
      return responseHandler(true, 'User added to account.');
    } catch (error) {
      return responseHandler(false, 'Could not add member to account');
    }
  }
}
