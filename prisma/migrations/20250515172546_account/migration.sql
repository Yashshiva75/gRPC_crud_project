-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('Current', 'Savings', 'Fixed_deposit');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('Active', 'Inactive');

-- CreateTable
CREATE TABLE "Account" (
    "id" UUID NOT NULL,
    "holderName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "type" "AccountType" NOT NULL,
    "status" "AccountStatus" NOT NULL DEFAULT 'Active',
    "balance" DOUBLE PRECISION NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "contactInfoId" UUID,
    "kycDetailsId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactInfo" (
    "id" UUID NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ContactInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KycDetails" (
    "id" UUID NOT NULL,
    "panCardNumber" TEXT NOT NULL,
    "aadharNumber" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "KycDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_accountNumber_key" ON "Account"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Account_contactInfoId_key" ON "Account"("contactInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_kycDetailsId_key" ON "Account"("kycDetailsId");

-- CreateIndex
CREATE UNIQUE INDEX "KycDetails_panCardNumber_key" ON "KycDetails"("panCardNumber");

-- CreateIndex
CREATE UNIQUE INDEX "KycDetails_aadharNumber_key" ON "KycDetails"("aadharNumber");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_contactInfoId_fkey" FOREIGN KEY ("contactInfoId") REFERENCES "ContactInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_kycDetailsId_fkey" FOREIGN KEY ("kycDetailsId") REFERENCES "KycDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;
