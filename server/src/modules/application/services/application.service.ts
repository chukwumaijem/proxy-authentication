import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validateOrReject } from 'class-validator';

import envs from 'src/config/app';
import { ApplicationEntity } from '../entities/application.entity';
import { RequestURLEntity } from '../entities/request-urls.entity';
import { responseHandler } from 'src/common/utils';
import {
  CreateApplicationInput,
  UpdateApplicationInput,
  RefreshKeyInput,
  AddRequestURLInput,
  UpdateRequestURLInput,
} from '../dto';
import { ICurrentUser, IKeyOption } from 'src/common/interfaces';
import { PUBLIC_KEY, SECRET_KEY } from 'src/common/constants/index';

const options = {
  SECRET_KEY: { prefix: 'sk', signature: envs.secretKeySignature, field: 'secretKey' },
  PUBLIC_KEY: { prefix: 'pk', signature: envs.publicKeySignature, field: 'publicKey' },
};

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(ApplicationEntity) private applicationRepo: Repository<ApplicationEntity>,
    @InjectRepository(RequestURLEntity) private requestURLRepo: Repository<RequestURLEntity>,
  ) {}

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
    return responseHandler(true, 'Application', { application });
  }

  async updateApplication(data: UpdateApplicationInput) {
    const { id, isActive } = data;
    const updateData = { ...data };

    try {
      const application = await this.applicationRepo.findOne(id, { relations: ['requestUrls'] });
      if (isActive && !application?.requestUrls?.length) {
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

  async removeApplication(applicationId: string) {
    try {
      const application = await this.applicationRepo.findOne(applicationId, { relations: ['requestUrls'] });
      const requestUrlIds = application.requestUrls.map(url => url.id);
      await this.requestURLRepo.delete(requestUrlIds);

      await this.applicationRepo.delete(applicationId);
      return responseHandler(true, 'Application deleted.');
    } catch (error) {
      return responseHandler(false, 'Failed to delete application.');
    }
  }

  async addRequestURL(data: AddRequestURLInput) {
    try {
      const { applicationId, url } = data;
      const application = await this.applicationRepo.findOne(applicationId);
      const newURL = this.requestURLRepo.create({ application, url });
      validateOrReject(newURL);
      await newURL.save();
      return responseHandler(true, 'Request URL added to application');
    } catch (error) {
      return responseHandler(false, 'Failed to add request url');
    }
  }

  async removeRequestURL(requestUrlId: string) {
    try {
      this.requestURLRepo.delete(requestUrlId);
      return responseHandler(true, 'Request URL removed');
    } catch (error) {
      return responseHandler(false, 'Failed to remove request URL');
    }
  }

  async updateRequestURL(data: UpdateRequestURLInput) {
    const { requestUrlId, url } = data;
    try {
      await this.requestURLRepo.update(requestUrlId, { url });
      return responseHandler(true, 'Request url updated.');
    } catch (error) {
      return responseHandler(false, 'Failed to update request url.');
    }
  }
}
