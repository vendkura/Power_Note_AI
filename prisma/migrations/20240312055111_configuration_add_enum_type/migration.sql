/*
  Warnings:

  - Changed the type of `type` on the `Configuration` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `Information` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ConfigurationType" AS ENUM ('BOOLEAN', 'STRING', 'NUMBER');

-- AlterTable
ALTER TABLE "Configuration" DROP COLUMN "type",
ADD COLUMN     "type" "ConfigurationType" NOT NULL;

-- AlterTable
ALTER TABLE "Information" DROP COLUMN "type",
ADD COLUMN     "type" "ConfigurationType" NOT NULL;
