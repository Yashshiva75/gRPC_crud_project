/*
  Warnings:

  - Added the required column `subject` to the `student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "student" ADD COLUMN     "subject" UUID NOT NULL;

-- CreateTable
CREATE TABLE "subject" (
    "id" UUID NOT NULL,
    "sub_name" TEXT NOT NULL,

    CONSTRAINT "subject_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_subject_fkey" FOREIGN KEY ("subject") REFERENCES "subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
