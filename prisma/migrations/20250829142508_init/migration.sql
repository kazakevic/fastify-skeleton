/*
  Warnings:

  - A unique constraint covering the columns `[teamMemberId,key]` on the table `TeamMemberAttribute` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TeamMemberAttribute_teamMemberId_key_key" ON "public"."TeamMemberAttribute"("teamMemberId", "key");
