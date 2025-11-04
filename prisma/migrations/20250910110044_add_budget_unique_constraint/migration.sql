/*
  Warnings:

  - You are about to drop the column `amount` on the `Budget` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,categoryId]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `completness` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentAmount` to the `Budget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Budget" DROP COLUMN "amount",
ADD COLUMN     "completness" INTEGER NOT NULL,
ADD COLUMN     "currentAmount" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Budget_userId_categoryId_key" ON "public"."Budget"("userId", "categoryId");
