/*
  Warnings:

  - Added the required column `createdBy` to the `Taxation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `effectiveFrom` to the `Taxation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `effectiveTo` to the `Taxation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeAddressId` to the `Taxation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeInfoId` to the `Taxation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Taxation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Taxation" ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "documentNumber" TEXT,
ADD COLUMN     "effectiveFrom" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "effectiveTo" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "employeeAddressId" INTEGER NOT NULL,
ADD COLUMN     "employeeInfoId" INTEGER NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "type" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "EmployeeInfo" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "designation" TEXT NOT NULL,
    "maritalStatus" TEXT NOT NULL,
    "department" TEXT,
    "joiningDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EmployeeInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeAddress" (
    "id" SERIAL NOT NULL,
    "houseNo" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "pinCode" TEXT NOT NULL,
    "landmark" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EmployeeAddress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Taxation" ADD CONSTRAINT "Taxation_employeeInfoId_fkey" FOREIGN KEY ("employeeInfoId") REFERENCES "EmployeeInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Taxation" ADD CONSTRAINT "Taxation_employeeAddressId_fkey" FOREIGN KEY ("employeeAddressId") REFERENCES "EmployeeAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
