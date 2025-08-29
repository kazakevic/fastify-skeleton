import type {FastifyInstance} from "fastify";

export default async function userRoute(app: FastifyInstance) {

    app.get("/api/v1/user/info", {preHandler: [app.authenticate]}, async (request, reply) => {
        const users = await app.prisma.user.findMany();
        reply.send(users);
    })
}
