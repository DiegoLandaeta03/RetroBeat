/*
  Warnings:

  - Added the required column `totalPreferences` to the `Stitch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stitch" ADD COLUMN     "totalPreferences" DOUBLE PRECISION NOT NULL;
