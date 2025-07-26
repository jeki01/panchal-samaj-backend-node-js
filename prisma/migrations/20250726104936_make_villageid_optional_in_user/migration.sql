-- AlterTable
ALTER TABLE "users" ADD COLUMN     "villageId" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "village"("id") ON DELETE SET NULL ON UPDATE CASCADE;
