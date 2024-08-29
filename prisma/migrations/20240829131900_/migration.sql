-- CreateEnum
CREATE TYPE "CoachType" AS ENUM ('STUDY', 'PARENTAL', 'SPORT');

-- CreateEnum
CREATE TYPE "CallType" AS ENUM ('AUDIO', 'VIDEO');

-- CreateEnum
CREATE TYPE "MsgType" AS ENUM ('TEXT', 'IMAGE', 'AUDIO');

-- CreateEnum
CREATE TYPE "Sender" AS ENUM ('USER', 'COACH');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "otp" INTEGER,
    "otpExpiry" TIMESTAMP(3),
    "language" TEXT NOT NULL,
    "cnxtype" TEXT NOT NULL,
    "pictureUrl" TEXT NOT NULL,
    "birthDate" TEXT NOT NULL,
    "pays" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coach" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pictureUrl" TEXT NOT NULL,
    "type" "CoachType" NOT NULL,

    CONSTRAINT "Coach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserResponse" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "response" TEXT NOT NULL,

    CONSTRAINT "UserResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Call" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "coachId" INTEGER NOT NULL,
    "callType" "CallType" NOT NULL,
    "startedAt" TEXT NOT NULL,
    "endedAt" TEXT,
    "duration" TEXT,

    CONSTRAINT "Call_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "msg" TEXT NOT NULL,
    "msgType" "MsgType" NOT NULL,
    "sender" "Sender" NOT NULL,
    "senderId" INTEGER NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_coachmember" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FavoriteCoaches" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_usermember" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Coach_name_key" ON "Coach"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Coach_pictureUrl_key" ON "Coach"("pictureUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Coach_type_key" ON "Coach"("type");

-- CreateIndex
CREATE UNIQUE INDEX "UserResponse_userId_id_key" ON "UserResponse"("userId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "_coachmember_AB_unique" ON "_coachmember"("A", "B");

-- CreateIndex
CREATE INDEX "_coachmember_B_index" ON "_coachmember"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FavoriteCoaches_AB_unique" ON "_FavoriteCoaches"("A", "B");

-- CreateIndex
CREATE INDEX "_FavoriteCoaches_B_index" ON "_FavoriteCoaches"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_usermember_AB_unique" ON "_usermember"("A", "B");

-- CreateIndex
CREATE INDEX "_usermember_B_index" ON "_usermember"("B");

-- AddForeignKey
ALTER TABLE "UserResponse" ADD CONSTRAINT "UserResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserResponse" ADD CONSTRAINT "UserResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "Coach"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_coachmember" ADD CONSTRAINT "_coachmember_A_fkey" FOREIGN KEY ("A") REFERENCES "Coach"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_coachmember" ADD CONSTRAINT "_coachmember_B_fkey" FOREIGN KEY ("B") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoriteCoaches" ADD CONSTRAINT "_FavoriteCoaches_A_fkey" FOREIGN KEY ("A") REFERENCES "Coach"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoriteCoaches" ADD CONSTRAINT "_FavoriteCoaches_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_usermember" ADD CONSTRAINT "_usermember_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_usermember" ADD CONSTRAINT "_usermember_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
