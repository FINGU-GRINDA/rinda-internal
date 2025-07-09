/*
  Warnings:

  - The `validationData` column on the `WebsetRow` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ValidationStatus" AS ENUM ('VALID', 'INVALID', 'PENDING');

-- AlterTable
ALTER TABLE "WebsetRow" DROP COLUMN "validationData",
ADD COLUMN     "validationData" "ValidationStatus"[];
