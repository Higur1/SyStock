/*
  Warnings:

  - A unique constraint covering the columns `[company_id]` on the table `company_address` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "company_address_company_id_key" ON "company_address"("company_id");
