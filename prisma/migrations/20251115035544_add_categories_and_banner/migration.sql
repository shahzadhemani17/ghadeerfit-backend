-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_categories" (
    "id" SERIAL NOT NULL,
    "videoId" INTEGER NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "video_categories_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "videos" ADD COLUMN "banner_image_url" TEXT;
ALTER TABLE "videos" ADD COLUMN "description" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "video_categories_videoId_idx" ON "video_categories"("videoId");

-- CreateIndex
CREATE INDEX "video_categories_categoryId_idx" ON "video_categories"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "video_categories_videoId_categoryId_key" ON "video_categories"("videoId", "categoryId");

-- AddForeignKey
ALTER TABLE "video_categories" ADD CONSTRAINT "video_categories_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_categories" ADD CONSTRAINT "video_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

