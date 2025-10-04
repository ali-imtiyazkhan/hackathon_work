import prisma from '../prismaClient.js';

export async function getUsersForCompany(companyId) {
  return prisma.user.findMany({
    where: { companyId },
    select: { id: true, email: true, fullName: true, role: true, managerId: true }
  });
}

export async function createUserInCompany(companyId, { email, fullName, role, passwordHash, managerId }) {
  return prisma.user.create({
    data: {
      email,
      fullName,
      passwordHash,
      role,
      companyId,
      managerId
    }
  });
}

export async function updateUser(id, companyId, data) {
  return prisma.user.updateMany({
    where: { id, companyId },
    data
  });
}
