export class JobOffer {
  title: string;
  location: string;
  company: string;
  salary: string | null;
  postedAt: string;

  constructor(data: JobOffer) {
    Object.assign(this, data);
  }
}
