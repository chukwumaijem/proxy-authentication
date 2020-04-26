import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validateOrReject } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import envs from '../../../config/app';
import { AccountUserEntity } from '../entities/account-user.entity';
import { LoginDto, LoginResponse, ChangePasswordDto, ChangePasswordResponse } from '../dto';
import { IUser } from '../../../common/interfaces';

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

  private verifyPassword(received, saved): boolean {
    return bcrypt.compareSync(received, saved);
  }

  private generateToken(email): string {
    return sign({ email }, envs.authSecret, { expiresIn: '7d' });
  }

  async createDefaultAccount(): Promise<void> {
    const { defaultAccountEmail } = envs;
    if (!defaultAccountEmail) {
      throw new Error('No Account users found. A DEFAULT_ACCOUNT_EMAIL is required to generate one.');
    } else {
      this.createAccountUser(defaultAccountEmail);
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
    const user = await this.accountUserRepo.findOne({ email });

    if (!this.verifyPassword(password, user.password)) return response;

    response.success = true;
    response.data = { token: this.generateToken(user.email), user };
    response.message = 'Login Success.';

    return response;
  }

  async createAccountUser(email: string) {
    try {
      const userData = { email, password: this.generatePassword() };
      const user = this.accountUserRepo.create(userData);
      await validateOrReject(user);
      user.save();
      this.sendInvitation(user);
    } catch (error) {
      throw new Error(`Could not create default user: ${error}`);
    }
  }

  async changePassword(data: ChangePasswordDto, currentUser: IUser): Promise<ChangePasswordResponse> {
    const response = { message: 'Could not change user password', success: false, token: null };
    const user = await this.accountUserRepo.findOne({ email: currentUser.email });

    if (!user) return response;
    if (!this.verifyPassword(data.currentPassword, user.password)) return response;
    user.password = data.newPassword;
    user.default_password_changed = true;
    user.save();

    response.message = 'Password changed successfully';
    response.success = true;
    response.token = this.generateToken(user.email);
    return response;
  }
}
