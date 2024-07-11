/*
  Warnings:

  - Changed the type of `artists` on the `Song` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Song" DROP COLUMN "artists",
ADD COLUMN     "artists" JSONB NOT NULL;
