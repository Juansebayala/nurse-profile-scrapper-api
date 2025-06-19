import { Controller, Get, Query } from '@nestjs/common';
import { JobOfferService } from '../application/services/job-offer.service';
import { GetAllQueryDto } from '../application/dto/get-all-query.dto';
import { JobOffer } from '../domain/job-offer.domain';
import { BaseGetAllInterface } from '../../common/application/interface/base-get-all.interface';

@Controller('job-offer')
export class JobOfferController {
  constructor(private readonly jobOfferService: JobOfferService) {}

  @Get()
  async getJobOffers(
    @Query() query: GetAllQueryDto,
  ): Promise<BaseGetAllInterface<JobOffer>> {
    return await this.jobOfferService.getJobOffers(query);
  }
}
