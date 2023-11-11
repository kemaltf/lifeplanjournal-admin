import { PrismaClient } from '@prisma/client';
// Declare a global namespace for PrismaClient instance
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a PrismaClient instance or use an existing one from the global scope
const prismadb = globalThis.prisma || new PrismaClient();

// If not in production, set globalThis.prisma to the created instance
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prismadb;

// Export the PrismaClient instance for use in other parts of the application
export default prismadb;
