import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validateOrReject } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import envs from '../../../config/app';
import { AccountUserEntity } from '../entities/account-user.entity';
import { LoginDto, LoginResponse } from '../dto';

@Injectable()
export class AccountUserService {
  constructor(
    @InjectRepository(AccountUserEntity)
    private acountUserRepo: Repository<AccountUserEntity>,
  ) {}

  private verifyPassword(received, saved): boolean {
    return bcrypt.compareSync(received, saved);
  }

  private generateToken(email): string {
    return sign({ email }, envs.authSecret, { expiresIn: '1h' });
  }

  async accountUserlogin({
    email,
    password,
  }: LoginDto): Promise<LoginResponse> {
    const responseData = { success: false, message: '', data: null };
    const user = await this.acountUserRepo.findOne({ email });

    if (!this.verifyPassword(password, user.password)) {
      responseData.message = 'Login error. Try again.';
      return responseData;
    }

    responseData.success = true;
    responseData.data = {
      token: this.generateToken(user.email),
      user,
    };

    return responseData;
  }

  async countAccountUser(): Promise<Number> {
    const [_, accountUsersCount] = await this.acountUserRepo.findAndCount();
    return accountUsersCount;
  }

  private generatePassword(): string {
    const sliceNumber = Math.floor(Math.random() * 5) + 10;
    return Buffer.from(Math.random().toString())
      .toString('base64')
      .slice(sliceNumber);
  }

  async createAccountUser(email: string) {
    try {
      const userData = { email, password: this.generatePassword() };
      const user = this.acountUserRepo.create(userData);
      await validateOrReject(user);
      user.save();
      this.sendInvitation(user);
    } catch (error) {
      throw new Error(`Could not create default user: ${error}`);
    }
  }

  sendInvitation(data) {
    // Todo: Move this method to notification module.
    console.log('Default User Credntials: \t', JSON.stringify(data, null, 2));
  }

  async createDefaultAccount(): Promise<void> {
    const { defaultAccountEmail } = envs;
    if (!defaultAccountEmail) {
      throw new Error(
        'No Account users found. A DEFAULT_ACCOUNT_EMAIL is required to generate one.',
      );
    } else {
      this.createAccountUser(defaultAccountEmail);
    }
  }
}
