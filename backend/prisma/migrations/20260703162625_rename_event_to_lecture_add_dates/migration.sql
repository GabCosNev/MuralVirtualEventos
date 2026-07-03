/*
  Warnings:

  - The values [EVENT] on the enum `EventType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `endDate` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EventType_new" AS ENUM ('ANNOUNCEMENT', 'LECTURE', 'CELEBRATION');
ALTER TABLE "Post" ALTER COLUMN "eventType" TYPE "EventType_new" USING ("eventType"::text::"EventType_new");
ALTER TYPE "EventType" RENAME TO "EventType_old";
ALTER TYPE "EventType_new" RENAME TO "EventType";
DROP TYPE "public"."EventType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;
