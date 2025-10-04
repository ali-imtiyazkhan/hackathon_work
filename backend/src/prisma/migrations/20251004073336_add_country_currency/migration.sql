-- CreateEnum
CREATE TYPE "ExpenseStatus" AS ENUM ('Submitted', 'Pending', 'Approved', 'Rejected');

-- CreateEnum
CREATE TYPE "ApprovalDecision" AS ENUM ('Pending', 'Approved', 'Rejected');

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "countryCode" TEXT,
ADD COLUMN     "currencyCode" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "managerId" TEXT;

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "amountInCompanyCurrency" DECIMAL(12,2) NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "dateOfExpense" TIMESTAMP(3) NOT NULL,
    "receiptUrl" TEXT,
    "status" "ExpenseStatus" NOT NULL DEFAULT 'Submitted',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalFlow" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApprovalFlow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalStep" (
    "id" TEXT NOT NULL,
    "flowId" TEXT NOT NULL,
    "approverId" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,

    CONSTRAINT "ApprovalStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalRule" (
    "id" TEXT NOT NULL,
    "flowId" TEXT NOT NULL,
    "percentage" INTEGER,
    "specificRole" "Role",

    CONSTRAINT "ApprovalRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Approval" (
    "id" TEXT NOT NULL,
    "expenseId" TEXT NOT NULL,
    "approverId" TEXT NOT NULL,
    "decision" "ApprovalDecision" NOT NULL DEFAULT 'Pending',
    "comment" TEXT,

    CONSTRAINT "Approval_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApprovalRule_flowId_key" ON "ApprovalRule"("flowId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalFlow" ADD CONSTRAINT "ApprovalFlow_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalStep" ADD CONSTRAINT "ApprovalStep_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "ApprovalFlow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalStep" ADD CONSTRAINT "ApprovalStep_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRule" ADD CONSTRAINT "ApprovalRule_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "ApprovalFlow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
