import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";

export default fp(async (app: { decorate: (arg0: string, arg1: any) => void; addHook: (arg0: string, arg1: (app: any) => Promise<void>) => void; }) => {
    const prisma = new PrismaClient();

    // Make prisma available as app.prisma
    app.decorate("prisma", prisma);

    // Ensure Prisma disconnects on shutdown
    app.addHook("onClose", async (app) => {
        await app.prisma.$disconnect();
    });
});

// Extend Fastify type definitions (TypeScript only)
declare module "fastify" {
    interface FastifyInstance {
        prisma: PrismaClient;
    }
}
