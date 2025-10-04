import express from 'express';
import { submit, myExpenses, pendingApprovals, doApprove } from '../controllers/expense.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';


const router = express.Router();
router.use(authMiddleware);
router.post('/', authorizeRoles('Employee'), submit);
router.get('/mine', myExpenses);
router.get('/pending', authorizeRoles('Manager'), pendingApprovals);
router.post('/:id/approve', authorizeRoles('Manager'), doApprove);
export default router;
