/*
  Warnings:

  - A unique constraint covering the columns `[title,location,company,salary]` on the table `jobOffer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "jobOffer_title_location_company_salary_key" ON "jobOffer"("title", "location", "company", "salary");
