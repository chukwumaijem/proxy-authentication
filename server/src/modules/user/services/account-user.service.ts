import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validateOrReject } from 'class-validator';
import { compareSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import envs from '../../../config/app';
import { AccountUserEntity } from '../entities/account-user.entity';
import { LoginDto, LoginResponse, ChangePasswordDto, ChangePasswordResponse } from '../dto';
import { ICurrentUser, IUser } from '../../../common/interfaces';
import { SuccessFailResponse } from '../../../common/dto';
import { DEFAULT_USER } from '../constants';

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

  async accountUserlogin({ email, password }: LoginDto): Promise<LoginResponse> {
    const response = { success: false, message: 'Login error. Try again.', data: null };
    const user = await this.findUserByEmail(email);

    if (!this.verifyPassword(password, user.password)) return response;

    response.success = true;
    response.data = { token: this.generateToken(user.email), user };
    response.message = 'Login Success.';

    return response;
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

  async changePassword(data: ChangePasswordDto, currentUser: ICurrentUser): Promise<ChangePasswordResponse> {
    const response = { message: 'Could not change user password', success: false, token: null };
    const user = await this.accountUserRepo.findOne({ email: currentUser.email });

    if (!user) return response;
    if (!this.verifyPassword(data.currentPassword, user.password)) return response;
    user.password = data.newPassword;
    user.defaultPasswordChanged = true;
    user.save();

    response.message = 'Password changed successfully';
    response.success = true;
    response.token = this.generateToken(user.email);
    return response;
  }

  async addAccountUser(email: string, currentUser: ICurrentUser): Promise<SuccessFailResponse> {
    const response = { success: false, message: 'Could not add member to account' };
    const user = await this.accountUserRepo.findOne({ email: currentUser.email });

    try {
      this.createAccountUser(email, user.id);
      response.success = true;
      response.message = 'User added to account.';
      return response;
    } catch (error) {
      return response;
    }
  }
}
