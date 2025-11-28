-- CreateEnum
CREATE TYPE "RepeatInterval" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "isRecurring" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nextTimeAt" TIMESTAMP(3),
ADD COLUMN     "repeatInterval" "RepeatInterval";
