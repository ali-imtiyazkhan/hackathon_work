import prisma from '../prismaClient.js';
import { convertCurrency } from './currency.service.js';

export async function submitExpense(companyId, userId, { amount, currency, category, description, dateOfExpense, receiptUrl }) {
  if (!userId) throw new Error('User ID missing – check auth');
  if (!companyId) throw new Error('Company ID missing');

  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company) throw new Error('Company not found');

  console.log('Company:', JSON.stringify(company, null, 2));

  const targetCurrency = company.currencyCode || 'INR';
  const converted = await convertCurrency(currency, targetCurrency, amount);

  return prisma.expense.create({
    data: {
      companyId,
      userId,
      amount,
      currency,
      amountInCompanyCurrency: converted,
      category,
      description,
      dateOfExpense,
      receiptUrl,
      status: 'Pending',
    },
  });
}

export async function listMyExpenses(userId) {
  if (!userId) throw new Error('User ID missing');
  return prisma.expense.findMany({ where: { userId } });
}

export async function listPendingApprovals(companyId) {
  if (!companyId) throw new Error('Company ID missing');
  return prisma.expense.findMany({ where: { companyId, status: 'Pending' } });
}

export async function approveExpense(expenseId, approverId, comment) {
  if (!expenseId || !approverId) throw new Error('Missing IDs for approval');

  const approval = await prisma.approval.create({
    data: { expenseId, approverId, decision: 'Approved', comment },
  });

  await prisma.expense.update({
    where: { id: expenseId },
    data: { status: 'Approved' },
  });

  return approval;
}
