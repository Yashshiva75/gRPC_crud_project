/*
  Warnings:

  - You are about to drop the column `aadharNumber` on the `KycDetails` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "KycDetails_aadharNumber_key";

-- AlterTable
ALTER TABLE "KycDetails" DROP COLUMN "aadharNumber";
