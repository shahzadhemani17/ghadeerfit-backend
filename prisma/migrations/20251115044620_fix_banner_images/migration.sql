-- CreateTable
CREATE TABLE "banner_images" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "link_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banner_images_pkey" PRIMARY KEY ("id")
);

-- AlterTable - Remove banner_image_url from videos if it exists
ALTER TABLE "videos" DROP COLUMN IF EXISTS "banner_image_url";

