import * as userService from '../services/user.service.js';
import bcrypt from 'bcrypt';
import prisma from '../prismaClient.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


export const listUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { companyId: req.user.companyId },
            select: { id: true, email: true, fullName: true, role: true },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
};


export async function createUser(req, res) {
  try {
    const { email, fullName, role, managerId, password, companyId } = req.body;

    if (!email || !password || !role || !fullName) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    // Use companyId from request body or fallback to req.user.companyId
    const userCompanyId = companyId || req.user.companyId;

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the user
    const user = await userService.createUserInCompany(userCompanyId, {
      email,
      fullName,
      role,
      passwordHash,
      managerId,
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role, companyId: userCompanyId },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Respond with user details and token
    return res.status(201).json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      managerId: user.managerId,
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: err.message });
  }
}



export async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const data = req.body;
        if (data.password) {
            data.passwordHash = await bcrypt.hash(data.password, 10);
            delete data.password;
        }
        const result = await userService.updateUser(id, req.user.companyId, data);
        if (result.count === 0) {
            return res.status(404).json({ message: 'User not found or not in your company' });
        }
        return res.json({ message: 'Updated' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
}
