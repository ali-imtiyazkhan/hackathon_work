import prisma from '../prismaClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signup = async ({ email, password, fullName, companyName }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error('User already exists');

  const passwordHash = await bcrypt.hash(password, 10);

  // First, create the company
  const company = await prisma.company.create({
    data: {
      name: companyName || 'Default Company Name',
    }
  });

  // Then, create the user with the companyId
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      fullName,
      role: 'Admin',
      companyId: company.id,  // link user to the company here
    }
  });

  // Optionally generate token here if needed

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    companyId: user.companyId,
  };
};


export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid email or password');

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) throw new Error('Invalid email or password');

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  return token;
};
