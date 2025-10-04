/*
  Warnings:

  - You are about to drop the column `countryCode` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `currencyCode` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `managerId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExchangeRate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Expense` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RefreshToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."AuditLog" DROP CONSTRAINT "AuditLog_actorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AuditLog" DROP CONSTRAINT "AuditLog_companyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Expense" DROP CONSTRAINT "Expense_approverId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Expense" DROP CONSTRAINT "Expense_companyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Expense" DROP CONSTRAINT "Expense_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_companyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_managerId_fkey";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "countryCode",
DROP COLUMN "currencyCode";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "managerId",
ALTER COLUMN "companyId" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."AuditLog";

-- DropTable
DROP TABLE "public"."ExchangeRate";

-- DropTable
DROP TABLE "public"."Expense";

-- DropTable
DROP TABLE "public"."RefreshToken";

-- DropEnum
DROP TYPE "public"."ExpenseStatus";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
