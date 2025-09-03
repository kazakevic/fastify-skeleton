/*
  Warnings:

  - You are about to drop the `_TeamMemberToTeamMemberAttribute` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_TeamMemberToTeamMemberAttribute" DROP CONSTRAINT "_TeamMemberToTeamMemberAttribute_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_TeamMemberToTeamMemberAttribute" DROP CONSTRAINT "_TeamMemberToTeamMemberAttribute_B_fkey";

-- DropTable
DROP TABLE "public"."_TeamMemberToTeamMemberAttribute";

-- AddForeignKey
ALTER TABLE "public"."TeamMemberAttribute" ADD CONSTRAINT "TeamMemberAttribute_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "public"."TeamMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
