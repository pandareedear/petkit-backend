/*
  Warnings:

  - You are about to drop the column `adddress` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `adddress`,
    ADD COLUMN `address` VARCHAR(191) NULL;
