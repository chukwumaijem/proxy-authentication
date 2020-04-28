import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validateOrReject } from 'class-validator';

import envs from '../../../config/app';
import { ApplicationEntity } from '../entities/application.entity';
import { responseHandler } from '../../../common/utils';
import { CreateApplicationInput, UpdateApplicationInput, RefreshKeyInput } from '../dto';
import { ICurrentUser, IKeyOption } from '../../../common/interfaces';
import { PUBLIC_KEY, SECRET_KEY } from '../../../common/constants/index';

const options = {
  SECRET_KEY: { prefix: 'sk', signature: envs.secretKeySignature, field: 'secretKey' },
  PUBLIC_KEY: { prefix: 'pk', signature: envs.publicKeySignature, field: 'publicKey' },
};

@Injectable()
export class ApplicationService {
  constructor(@InjectRepository(ApplicationEntity) private applicationRepo: Repository<ApplicationEntity>) {}

  private generateKey(keyOption: IKeyOption): string {
    const { prefix, signature } = keyOption;
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
        secretKey: this.generateKey(options[SECRET_KEY]),
        publicKey: this.generateKey(options[PUBLIC_KEY]),
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

  async getApplication(applicationId: string) {
    const application = await this.applicationRepo.findOne(applicationId, { relations: ['requestUrls'] });
    return application;
  }

  async updateApplication(data: UpdateApplicationInput) {
    const { id, isActive } = data;
    const updateData = { ...data };

    try {
      const application = await this.applicationRepo.findOne(id, { relations: ['requestUrls'] });
      if (isActive && !application.requestUrls.length) {
        return responseHandler(false, 'Cannot set application to active if requestUrls are not provided.');
      }
      await this.applicationRepo.update(id, updateData);
      return responseHandler(true, 'Application Updated.');
    } catch (error) {
      return responseHandler(false, 'Could not update application.');
    }
  }

  async refreshSecretOrPrivateKey(refreshKeyInput: RefreshKeyInput) {
    const { applicationId, key } = refreshKeyInput;
    const option = options[Object.keys(options)[key]];

    const newKey = this.generateKey(option);
    try {
      await this.applicationRepo.update(applicationId, {
        [option.field]: newKey,
      });

      return responseHandler(true, 'Key Updated', { key: newKey });
    } catch (error) {
      return responseHandler(false, 'Failed to update key');
    }
  }
}
