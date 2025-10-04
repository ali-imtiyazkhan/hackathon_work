import express from 'express';
import { listUsers, createUser, updateUser } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';


const router = express.Router();
router.use(authMiddleware);
router.get('/', authorizeRoles('Admin'), listUsers);
router.post('/', authorizeRoles('Admin'), createUser);
router.patch('/:id', authorizeRoles('Admin'), updateUser);

export default router;
