import { PrismaClient } from '@prisma/client';
// Declare a global namespace for PrismaClient instance
// Baris kode declare global dan var prisma: PrismaClient | undefined;
// digunakan untuk memberikan deklarasi global pada TypeScript.
// if we delete, the globalThis.prisma will error
declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * globalThis.prisma adalah cara untuk melihat apakah sudah ada instance PrismaClient yang telah dibuat sebelumnya dan disimpan dalam objek global. Jika sudah ada, kita akan menggunakan instance yang sudah ada. Jika tidak, kita akan membuat instance baru dari PrismaClient.
 */
// Create a PrismaClient instance or use an existing one from the global scope
const prismadb = globalThis.prisma || new PrismaClient();

// If not in production, set globalThis.prisma to the created instance
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prismadb;

// Export the PrismaClient instance for use in other parts of the application
export default prismadb;
