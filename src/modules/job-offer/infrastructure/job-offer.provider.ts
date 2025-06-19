import { GetAllQueryDto } from '../application/dto/get-all-query.dto';
import { BaseGetAllInterface } from '../../common/application/interface/base-get-all.interface';
import { JobOfferRepository } from '../application/repository/job-offer.repository';
import { JobOffer } from '../domain/job-offer.domain';
import { chromium } from 'playwright';
import { envs } from 'src/config';
import { isAllowedByRobotsTxt } from 'src/modules/common/utils/robots-txt.util';
import { ConflictException } from '@nestjs/common';

export class JobOfferProvider implements JobOfferRepository {
  async findAll(query: GetAllQueryDto): Promise<BaseGetAllInterface<JobOffer>> {
    const pageParam = query.page || 1;
    const limitParam = query.limit || 10;

    const startIndex = (pageParam - 1) * limitParam;
    const endIndex = startIndex + limitParam;

    const offersPerWebPage = 20;
    const startWebPage = Math.floor(startIndex / offersPerWebPage) + 1;
    const endWebPage = Math.floor((endIndex - 1) / offersPerWebPage) + 1;

    if (!(await isAllowedByRobotsTxt(`${envs.jobOfferBaseUrl}`))) {
      throw new ConflictException('Scraping not allowed by robots.txt');
    }

    const browser = await chromium.launch({ headless: true });
    const allJobs: JobOffer[] = [];
    const delayMs = 2000;

    for (let webPage = startWebPage; webPage <= endWebPage; webPage++) {
      const page = await browser.newPage();
      await page.goto(`${envs.jobOfferBaseUrl}?page=${webPage}`);
      await page.waitForSelector('[data-qa="Job Card Wrapper"]');

      const jobs = await page.$$eval(
        '[data-qa="Job Card Wrapper"]',
        (elements) => {
          return elements.map((element) => {
            const title =
              (element.querySelector('[data-qa="Job Title"]') as HTMLElement)
                ?.innerText || '';
            const [location, company] = Array.from(
              element.querySelectorAll('ul li'),
            );
            const locationText = (location as HTMLElement)?.innerText || '';
            const companyText = (company as HTMLElement)?.innerText || '';
            const salary = element.querySelectorAll('h3')[1]?.innerText || null;
            const [, postedAt] = element.querySelectorAll(
              'section div div span',
            );
            const postedAtText = (postedAt as HTMLElement)?.innerText || '';
            return {
              title,
              location: locationText,
              company: companyText,
              salary,
              postedAt: postedAtText,
            };
          });
        },
      );

      allJobs.push(...jobs);
      await page.close();
      if (webPage < endWebPage) {
        await new Promise((res) => setTimeout(res, delayMs));
      }
    }

    await browser.close();

    const maxTotal = 50;
    const limitedJobs = allJobs.slice(0, maxTotal);

    const data = limitedJobs.slice(
      startIndex - (startWebPage - 1) * offersPerWebPage,
      endIndex - (startWebPage - 1) * offersPerWebPage,
    );

    return {
      data,
      page: pageParam,
      limit: limitParam,
    };
  }
}
