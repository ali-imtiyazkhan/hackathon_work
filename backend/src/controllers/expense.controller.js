import * as expenseService from '../services/expense.service.js';

export async function submit(req, res) {
  try {
    const companyId = req.user.companyId;
    const userId = req.user.id;

    const expense = await expenseService.submitExpense(companyId, userId, req.body);
    return res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: err.message });
  }
}

export async function myExpenses(req, res) {
  try {
    const expenses = await expenseService.listMyExpenses(req.user.id);
    return res.json(expenses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
}

export async function pendingApprovals(req, res) {
  try {
    const expenses = await expenseService.listPendingApprovals(req.user.companyId);
    return res.json(expenses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
}

export async function doApprove(req, res) {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const approval = await expenseService.approveExpense(id, req.user.id, comment);
    return res.json(approval);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: err.message });
  }
}
