-- CreateTable
CREATE TABLE "QBClass" (
    "id" UUID NOT NULL,
    "qbId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fullName" TEXT,
    "isSubClass" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "domainSource" TEXT,
    "versionToken" INTEGER NOT NULL DEFAULT 0,
    "isSparse" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QBClass_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QBClass_qbId_key" ON "QBClass"("qbId");
