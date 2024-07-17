/*
  Warnings:

  - You are about to drop the column `userName` on the `Users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Users_userName_key";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "userName",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "facebookId" TEXT,
ADD COLUMN     "googleId" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
