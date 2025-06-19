export const JOB_OFFER_PROVIDER = 'JOB_OFFER_PROVIDER';

export interface IJobOfferProvider {
  scrape(): Promise<void>;
}
