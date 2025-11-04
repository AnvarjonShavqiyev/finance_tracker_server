/*
  Warnings:

  - You are about to drop the column `dailyReport` on the `Settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "dailyReport",
ADD COLUMN     "sendDailyReports" BOOLEAN NOT NULL DEFAULT false;
