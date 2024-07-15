/*
  Warnings:

  - You are about to drop the column `genre` on the `Stitch` table. All the data in the column will be lost.
  - You are about to drop the column `mixability` on the `Stitch` table. All the data in the column will be lost.
  - Added the required column `explore` to the `Stitch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mix` to the `Stitch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stitch" DROP COLUMN "genre",
DROP COLUMN "mixability",
ADD COLUMN     "explore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "mix" DOUBLE PRECISION NOT NULL;
