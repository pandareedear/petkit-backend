/*
  Warnings:

  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE `Product` MODIFY `price` DECIMAL(10, 2) NOT NULL;
