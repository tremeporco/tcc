/*
  Warnings:

  - The primary key for the `reaction_history` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `substances` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "reaction_history" DROP CONSTRAINT "reaction_history_user_id_fkey";

-- AlterTable
ALTER TABLE "reaction_history" DROP CONSTRAINT "reaction_history_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "reaction_history_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "reaction_history_id_seq";

-- AlterTable
ALTER TABLE "substances" DROP CONSTRAINT "substances_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "substances_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "substances_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- AddForeignKey
ALTER TABLE "reaction_history" ADD CONSTRAINT "reaction_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
