/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `TeamMember` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uuid` to the `TeamMember` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."TeamMember" ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_uuid_key" ON "public"."TeamMember"("uuid");
