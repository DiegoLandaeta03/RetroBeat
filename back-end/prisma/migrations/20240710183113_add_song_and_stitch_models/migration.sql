-- CreateTable
CREATE TABLE "Stitch" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "mood" DOUBLE PRECISION NOT NULL,
    "dance" DOUBLE PRECISION NOT NULL,
    "mixability" DOUBLE PRECISION NOT NULL,
    "genre" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Stitch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" SERIAL NOT NULL,
    "uri" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "previewUrl" TEXT NOT NULL,
    "popularity" INTEGER NOT NULL,
    "stitchId" INTEGER NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Stitch" ADD CONSTRAINT "Stitch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_stitchId_fkey" FOREIGN KEY ("stitchId") REFERENCES "Stitch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
