-- CreateTable
CREATE TABLE "public"."TeamMemberAttribute" (
    "id" SERIAL NOT NULL,
    "teamMemberId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "TeamMemberAttribute_pkey" PRIMARY KEY ("id")
);
