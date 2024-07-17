/*
  Warnings:

  - Made the column `displayName` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Users_displayName_key";

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "displayName" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Bookmarks_mediaId_idx" ON "Bookmarks"("mediaId");

-- CreateIndex
CREATE INDEX "Bookmarks_userId_idx" ON "Bookmarks"("userId");
