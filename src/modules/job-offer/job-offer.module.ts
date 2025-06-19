import { Module } from '@nestjs/common';
import { JobOfferController } from './interface/job-offer.controller';
import { JobOfferService } from './application/services/job-offer.service';
import { JOB_OFFER_REPOSITORY } from './application/repository/job-offer.repository';
import { JobOfferProvider } from './infrastructure/job-offer.provider';

@Module({
  controllers: [JobOfferController],
  providers: [
    JobOfferService,
    {
      provide: JOB_OFFER_REPOSITORY,
      useClass: JobOfferProvider,
    },
  ],
})
export class JobOfferModule {}
