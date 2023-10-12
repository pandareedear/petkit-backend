/*
  Warnings:

  - You are about to alter the column `totalPrice` on the `Cart` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(10,2)`.
  - You are about to alter the column `totalPrice` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(10,2)`.
  - You are about to alter the column `totalPrice` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE `Cart` MODIFY `totalPrice` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `Order` MODIFY `totalPrice` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `OrderItem` MODIFY `totalPrice` DECIMAL(10, 2) NOT NULL;
