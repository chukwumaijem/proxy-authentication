import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validateOrReject } from 'class-validator';

import envs from '../../../config/app';
import { ApplicationEntity } from '../entities/application.entity';
import { RequestURLEntity } from '../entities/request-urls.entity';
import { responseHandler } from '../../../common/utils';
import { CreateApplicationInput } from '../dto';
import { ICurrentUser } from '../../../common/interfaces';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(ApplicationEntity) private applicationRepo: Repository<ApplicationEntity>,
    @InjectRepository(RequestURLEntity) private requestUrlRepo: Repository<RequestURLEntity>,
  ) {}

  private generateKey(prefix: string): string {
    const key = Buffer.from(`${envs.authSecret}${new Date().getDate()}`)
      .toString('base64')
      .substr(0, 30);

    return `${prefix}_${key}`;
  }

  async createApplication({ name, requestUrls }: CreateApplicationInput, currentUser: ICurrentUser) {
    try {
      let requestUrlIds = [];
      if (requestUrls.length) {
        const requestUrlObjects = requestUrls.map(item => ({
          url: item,
        }));

        const urlData = await this.requestUrlRepo.insert(requestUrlObjects);
        requestUrlIds = urlData.identifiers.map(item => item.id);
      }

      const applicationData = {
        name,
        createdBy: currentUser.id,
        secretKey: this.generateKey('sk'),
        publicKey: this.generateKey('pk'),
        requestUrls: requestUrlIds,
      };

      const application = await this.applicationRepo.create(applicationData);
      await validateOrReject(application);
      application.save();
      responseHandler(true, 'Application Created.');
    } catch (error) {
      responseHandler(false, 'Error Creating Application.');
    }
  }

  async getApplications() {
    const applications = await this.applicationRepo.find({ relations: ['requestUrls'] });
    return applications;
  }
}
