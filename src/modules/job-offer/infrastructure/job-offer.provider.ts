import { IJobOfferProvider } from '../application/repository/job-offer.provider';
import { JobOffer } from '../domain/job-offer.domain';
import { chromium } from 'playwright';
import { envs } from 'src/config';
import { isAllowedByRobotsTxt } from 'src/modules/common/utils/robots-txt.util';
import { ConflictException, Inject } from '@nestjs/common';
import {
  IJobOfferRepository,
  JOB_OFFER_REPOSITORY,
} from '../application/repository/job-offer.repository';

export class JobOfferProvider implements IJobOfferProvider {
  constructor(
    @Inject(JOB_OFFER_REPOSITORY)
    private readonly jobOfferRepository: IJobOfferRepository,
  ) {}

  async scrape(): Promise<void> {
    const totalOffers = 50;
    const offersPerWebPage = 20;
    const startWebPage = 1;
    const endWebPage = Math.ceil(totalOffers / offersPerWebPage);

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
              'section > div > div > span',
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
    const limitedJobs = allJobs.slice(0, totalOffers);

    await this.jobOfferRepository.upsertMany(limitedJobs);
  }
}
