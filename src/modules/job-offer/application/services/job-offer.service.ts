import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import {
  JOB_OFFER_PROVIDER,
  IJobOfferProvider,
} from '../repository/job-offer.provider';
import { GetAllQueryDto } from '../dto/get-all-query.dto';
import { JobOffer } from '../../domain/job-offer.domain';
import { BaseGetAllInterface } from '../../../common/application/interface/base-get-all.interface';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  IJobOfferRepository,
  JOB_OFFER_REPOSITORY,
} from '../repository/job-offer.repository';

@Injectable()
export class JobOfferService {
  private readonly logger = new Logger(JobOfferService.name);

  constructor(
    @Inject(JOB_OFFER_PROVIDER)
    private readonly jobOfferProvider: IJobOfferProvider,
    @Inject(JOB_OFFER_REPOSITORY)
    private readonly jobOfferRepository: IJobOfferRepository,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async scrape(): Promise<void> {
    try {
      await this.jobOfferProvider.scrape();
      this.logger.log('Job offers scraped successfully');
    } catch {
      this.logger.error('Failed to get jobs');
    }
  }

  async getJobOffers(
    query: GetAllQueryDto,
  ): Promise<BaseGetAllInterface<JobOffer>> {
    try {
      return await this.jobOfferRepository.findAll(query);
    } catch {
      throw new ConflictException('Failed to get jobs');
    }
  }
}
