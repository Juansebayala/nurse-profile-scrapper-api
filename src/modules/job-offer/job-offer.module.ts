import { Module } from '@nestjs/common';
import { JobOfferController } from './interface/job-offer.controller';
import { JobOfferService } from './application/services/job-offer.service';
import { JOB_OFFER_PROVIDER } from './application/repository/job-offer.provider';
import { JobOfferProvider } from './infrastructure/job-offer.provider';
import { CommonModule } from '../common/common.module';
import { JOB_OFFER_REPOSITORY } from './application/repository/job-offer.repository';
import { JobOfferRepository } from './infrastructure/persistence/job-offer.repository';

@Module({
  imports: [CommonModule],
  controllers: [JobOfferController],
  providers: [
    JobOfferService,
    {
      provide: JOB_OFFER_PROVIDER,
      useClass: JobOfferProvider,
    },
    {
      provide: JOB_OFFER_REPOSITORY,
      useClass: JobOfferRepository,
    },
  ],
})
export class JobOfferModule {}
