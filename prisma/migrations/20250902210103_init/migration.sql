-- CreateTable
CREATE TABLE "public"."_TeamMemberToTeamMemberAttribute" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TeamMemberToTeamMemberAttribute_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TeamMemberToTeamMemberAttribute_B_index" ON "public"."_TeamMemberToTeamMemberAttribute"("B");

-- AddForeignKey
ALTER TABLE "public"."_TeamMemberToTeamMemberAttribute" ADD CONSTRAINT "_TeamMemberToTeamMemberAttribute_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TeamMemberToTeamMemberAttribute" ADD CONSTRAINT "_TeamMemberToTeamMemberAttribute_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."TeamMemberAttribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
