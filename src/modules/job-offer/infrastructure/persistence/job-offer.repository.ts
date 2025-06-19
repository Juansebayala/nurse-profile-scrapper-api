import { Injectable } from '@nestjs/common';
import { JobOffer } from '../../domain/job-offer.domain';
import { BaseGetAllInterface } from 'src/modules/common/application/interface/base-get-all.interface';
import { GetAllQueryDto } from '../../application/dto/get-all-query.dto';
import { PrismaService } from 'src/modules/common/infrastructure/prisma/prisma.service';
import { IJobOfferRepository } from '../../application/repository/job-offer.repository';

@Injectable()
export class JobOfferRepository implements IJobOfferRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: GetAllQueryDto): Promise<BaseGetAllInterface<JobOffer>> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const take = limit;

    const jobOffers = await this.prisma.jobOffer.findMany({
      skip,
      take,
    });

    const total = await this.prisma.jobOffer.count();
    const totalOffers = total > 50 ? 50 : total;

    return {
      data: jobOffers,
      total: totalOffers,
      page: page || 1,
      limit: limit || 10,
    };
  }

  async upsertMany(jobOffers: JobOffer[]): Promise<void> {
    for (const offer of jobOffers) {
      await this.prisma.jobOffer.upsert({
        where: {
          title_location_company_salary: {
            title: offer.title,
            location: offer.location,
            company: offer.company,
            salary: offer.salary ?? '',
          },
        },
        update: {
          postedAt: offer.postedAt,
        },
        create: offer,
      });
    }
  }
}
