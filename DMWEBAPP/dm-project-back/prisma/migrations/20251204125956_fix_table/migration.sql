/*
  Warnings:

  - You are about to drop the column `date` on the `accident` table. All the data in the column will be lost.
  - Added the required column `airportCode` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amenity` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `astronomicalTwilight` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bump` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `civilTwilight` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `county` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `crossing` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dayOfWeek` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distance` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationSeconds` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endLat` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `giveWay` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hour` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `humidity` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `junction` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `month` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nauticalTwilight` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noExit` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pressure` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `railway` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roundabout` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `severity` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startLat` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `station` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stop` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sunriseSunset` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `temperature` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timezone` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trafficCalming` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trafficSignal` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `turningLoop` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visibility` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weatherCondition` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weatherTimestamp` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `windDirection` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `windSpeed` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipcode` to the `Accident` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `accident` DROP COLUMN `date`,
    ADD COLUMN `airportCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `amenity` BOOLEAN NOT NULL,
    ADD COLUMN `astronomicalTwilight` VARCHAR(191) NOT NULL,
    ADD COLUMN `bump` BOOLEAN NOT NULL,
    ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `civilTwilight` VARCHAR(191) NOT NULL,
    ADD COLUMN `country` VARCHAR(191) NOT NULL,
    ADD COLUMN `county` VARCHAR(191) NOT NULL,
    ADD COLUMN `crossing` BOOLEAN NOT NULL,
    ADD COLUMN `dayOfWeek` VARCHAR(191) NOT NULL,
    ADD COLUMN `distance` DOUBLE NOT NULL,
    ADD COLUMN `durationSeconds` INTEGER NOT NULL,
    ADD COLUMN `endLat` DECIMAL(20, 10) NOT NULL,
    ADD COLUMN `endTime` DATETIME(3) NOT NULL,
    ADD COLUMN `giveWay` BOOLEAN NOT NULL,
    ADD COLUMN `hour` INTEGER NOT NULL,
    ADD COLUMN `humidity` DOUBLE NOT NULL,
    ADD COLUMN `junction` BOOLEAN NOT NULL,
    ADD COLUMN `month` INTEGER NOT NULL,
    ADD COLUMN `nauticalTwilight` VARCHAR(191) NOT NULL,
    ADD COLUMN `noExit` BOOLEAN NOT NULL,
    ADD COLUMN `pressure` DOUBLE NOT NULL,
    ADD COLUMN `railway` BOOLEAN NOT NULL,
    ADD COLUMN `roundabout` BOOLEAN NOT NULL,
    ADD COLUMN `severity` INTEGER NOT NULL,
    ADD COLUMN `source` VARCHAR(191) NOT NULL,
    ADD COLUMN `startLat` DECIMAL(20, 10) NOT NULL,
    ADD COLUMN `startTime` DATETIME(3) NOT NULL,
    ADD COLUMN `state` VARCHAR(191) NOT NULL,
    ADD COLUMN `station` BOOLEAN NOT NULL,
    ADD COLUMN `stop` BOOLEAN NOT NULL,
    ADD COLUMN `street` VARCHAR(191) NOT NULL,
    ADD COLUMN `sunriseSunset` VARCHAR(191) NOT NULL,
    ADD COLUMN `temperature` DOUBLE NOT NULL,
    ADD COLUMN `timezone` VARCHAR(191) NOT NULL,
    ADD COLUMN `trafficCalming` BOOLEAN NOT NULL,
    ADD COLUMN `trafficSignal` BOOLEAN NOT NULL,
    ADD COLUMN `turningLoop` BOOLEAN NOT NULL,
    ADD COLUMN `visibility` DOUBLE NOT NULL,
    ADD COLUMN `weatherCondition` VARCHAR(191) NOT NULL,
    ADD COLUMN `weatherTimestamp` DATETIME(3) NOT NULL,
    ADD COLUMN `windDirection` VARCHAR(191) NOT NULL,
    ADD COLUMN `windSpeed` DECIMAL(20, 10) NOT NULL,
    ADD COLUMN `year` INTEGER NOT NULL,
    ADD COLUMN `zipcode` VARCHAR(191) NOT NULL;
