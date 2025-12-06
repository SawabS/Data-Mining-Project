/*
  Warnings:

  - You are about to drop the column `endLat` on the `accident` table. All the data in the column will be lost.
  - Added the required column `startLng` to the `Accident` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `accident` DROP COLUMN `endLat`,
    ADD COLUMN `startLng` DECIMAL(20, 10) NOT NULL;
