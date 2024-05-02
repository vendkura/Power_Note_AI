/*
  Warnings:

  - The primary key for the `Configuration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Information` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Note` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Summary` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Information" DROP CONSTRAINT "Information_noteId_fkey";

-- AlterTable
ALTER TABLE "Configuration" DROP CONSTRAINT "Configuration_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Configuration_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Configuration_id_seq";

-- AlterTable
ALTER TABLE "Information" DROP CONSTRAINT "Information_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "noteId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Information_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Information_id_seq";

-- AlterTable
ALTER TABLE "Note" DROP CONSTRAINT "Note_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Note_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Note_id_seq";

-- AlterTable
ALTER TABLE "Summary" DROP CONSTRAINT "Summary_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Summary_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Summary_id_seq";

-- AddForeignKey
ALTER TABLE "Information" ADD CONSTRAINT "Information_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
