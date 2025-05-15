-- CreateTable
CREATE TABLE "Taxation" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "taxRate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Taxation_pkey" PRIMARY KEY ("id")
);
