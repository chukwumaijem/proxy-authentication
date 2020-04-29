import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validateOrReject } from 'class-validator';

import envs from 'src/config/app';
import { ApplicationEntity } from '../entities/application.entity';
import { responseHandler } from 'src/common/utils';
import { CreateApplicationInput } from '../dto';
import { ICurrentUser } from 'src/common/interfaces';

@Injectable()
export class ApplicationService {
  constructor(@InjectRepository(ApplicationEntity) private applicationRepo: Repository<ApplicationEntity>) {}

  private generateKey(prefix: string, signature: string): string {
    const key = Buffer.from(`${signature}${new Date().getTime()}`)
      .toString('base64')
      .substr(0, 35);

    return `${prefix}_${key}`;
  }

  async createApplication({ name, requestUrls }: CreateApplicationInput, currentUser: ICurrentUser) {
    try {
      const requestUrlObjects = requestUrls.map(requestUrl => ({
        url: requestUrl,
      }));

      const applicationData = {
        name,
        createdBy: currentUser.id,
        secretKey: this.generateKey('sk', envs.secretKeySignature),
        publicKey: this.generateKey('pk', envs.publicKeySignature),
        requestUrls: requestUrlObjects,
      };

      const application = this.applicationRepo.create(applicationData);
      await validateOrReject(application);
      await application.save();
      return responseHandler(true, 'Application Created.', { application });
    } catch (error) {
      return responseHandler(false, 'Error Creating Application.');
    }
  }

  async getApplications() {
    const applications = await this.applicationRepo.find({ relations: ['requestUrls'] });
    return applications;
  }
}
