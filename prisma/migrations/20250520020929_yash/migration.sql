/*
  Warnings:

  - Added the required column `age` to the `student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "student" ADD COLUMN     "age" INTEGER NOT NULL;
