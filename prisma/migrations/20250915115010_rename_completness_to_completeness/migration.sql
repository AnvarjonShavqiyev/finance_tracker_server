/*
  Warnings:

  - You are about to drop the column `completness` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `currentAmount` on the `Budget` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Budget" DROP COLUMN "completness",
DROP COLUMN "currentAmount",
ADD COLUMN     "completeness" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usage" INTEGER NOT NULL DEFAULT 0;
