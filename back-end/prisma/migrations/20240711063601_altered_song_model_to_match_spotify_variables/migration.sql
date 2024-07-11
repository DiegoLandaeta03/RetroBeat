/*
  Warnings:

  - You are about to drop the column `duration` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `previewUrl` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Song` table. All the data in the column will be lost.
  - Added the required column `album` to the `Song` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration_ms` to the `Song` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Song` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preview_url` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Song" DROP COLUMN "duration",
DROP COLUMN "image",
DROP COLUMN "previewUrl",
DROP COLUMN "title",
ADD COLUMN     "album" JSONB NOT NULL,
ADD COLUMN     "duration_ms" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "preview_url" TEXT NOT NULL;
