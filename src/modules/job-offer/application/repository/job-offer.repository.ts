import { JobOffer } from 'src/modules/job-offer/domain/job-offer.domain';
import { GetAllQueryDto } from '../dto/get-all-query.dto';
import { BaseGetAllInterface } from 'src/modules/common/application/interface/base-get-all.interface';

export const JOB_OFFER_REPOSITORY = 'JOB_OFFER_REPOSITORY';

export interface JobOfferRepository {
  findAll(query: GetAllQueryDto): Promise<BaseGetAllInterface<JobOffer>>;
}
