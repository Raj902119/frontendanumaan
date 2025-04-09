// Mock Prisma client for frontend-only deployment
const mockPrisma = {
  user: {
    findUnique: () => Promise.resolve(null),
    create: () => Promise.resolve(null),
    update: () => Promise.resolve(null),
    findMany: () => Promise.resolve([]),
  },
  portfolio: {
    findMany: () => Promise.resolve([]),
    upsert: () => Promise.resolve(null),
  },
  oTP: {
    create: () => Promise.resolve(null),
    findFirst: () => Promise.resolve(null),
    delete: () => Promise.resolve(null),
  },
  $disconnect: () => Promise.resolve(),
};

export const prisma = mockPrisma; 