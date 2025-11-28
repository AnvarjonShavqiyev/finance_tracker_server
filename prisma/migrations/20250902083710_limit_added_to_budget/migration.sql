/*
  Warnings:

  - Added the required column `limit` to the `Budget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Budget" ADD COLUMN     "limit" INTEGER NOT NULL;
