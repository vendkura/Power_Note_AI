/*
  Warnings:

  - Made the column `language` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable

-- Set to every user the language to "English" if it's null
UPDATE "User" SET "language" = 'English' WHERE "language" IS NULL;

ALTER TABLE "User" ALTER COLUMN "language" SET NOT NULL,
ALTER COLUMN "language" SET DEFAULT 'English';
