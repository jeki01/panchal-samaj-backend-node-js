/*
  Warnings:

  - The values [ADMIN,MEMBER,MODERATOR,GUEST] on the enum `GlobalRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GlobalRole_new" AS ENUM ('SUPER_ADMIN', 'VILLAGE_MEMBER', 'CHOKHLA_MEMBER');
ALTER TABLE "users" ALTER COLUMN "globalRole" TYPE "GlobalRole_new" USING ("globalRole"::text::"GlobalRole_new");
ALTER TYPE "GlobalRole" RENAME TO "GlobalRole_old";
ALTER TYPE "GlobalRole_new" RENAME TO "GlobalRole";
DROP TYPE "GlobalRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "lastLogout" TIMESTAMP(3);
