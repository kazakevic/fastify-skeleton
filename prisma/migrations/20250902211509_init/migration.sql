/*
  Warnings:

  - You are about to drop the `_TeamMemberToTeamMemberAttribute` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `teamMemberId` on the `TeamMemberAttribute` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."_TeamMemberToTeamMemberAttribute" DROP CONSTRAINT "_TeamMemberToTeamMemberAttribute_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_TeamMemberToTeamMemberAttribute" DROP CONSTRAINT "_TeamMemberToTeamMemberAttribute_B_fkey";

-- AlterTable
ALTER TABLE "public"."TeamMemberAttribute" DROP COLUMN "teamMemberId",
ADD COLUMN     "teamMemberId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."_TeamMemberToTeamMemberAttribute";

-- CreateIndex
CREATE UNIQUE INDEX "TeamMemberAttribute_teamMemberId_key_key" ON "public"."TeamMemberAttribute"("teamMemberId", "key");

-- AddForeignKey
ALTER TABLE "public"."TeamMemberAttribute" ADD CONSTRAINT "TeamMemberAttribute_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "public"."TeamMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
