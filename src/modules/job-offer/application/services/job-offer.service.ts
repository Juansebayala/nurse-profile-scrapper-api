import { ConflictException, Inject, Injectable } from '@nestjs/common';
import {
  JOB_OFFER_REPOSITORY,
  JobOfferRepository,
} from '../repository/job-offer.repository';
import { GetAllQueryDto } from '../dto/get-all-query.dto';
import { JobOffer } from '../../domain/job-offer.domain';
import { BaseGetAllInterface } from '../../../common/application/interface/base-get-all.interface';

@Injectable()
export class JobOfferService {
  constructor(
    @Inject(JOB_OFFER_REPOSITORY)
    private readonly jobOfferRepository: JobOfferRepository,
  ) {}

  async getJobOffers(
    query: GetAllQueryDto,
  ): Promise<BaseGetAllInterface<JobOffer>> {
    try {
      return this.jobOfferRepository.findAll(query);
    } catch {
      throw new ConflictException('Failed to get jobs');
    }
  }
}
