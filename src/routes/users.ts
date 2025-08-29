import type {FastifyInstance} from "fastify";

export default async function userRoute(app: FastifyInstance) {

    app.get("/api/v1/user/info", {preHandler: [app.authenticate]}, async (request, reply) => {
        const userId = (request.user as { id: string }).id;

        const user = await app.prisma.user.findUnique({
            where: { uuid: userId },
            select: {
                uuid: true,
                username: true,
                email: true,
            }
        });

        if (!user) {
            return reply.status(404).send({ error: "User not found" });
        }

        return reply.send({ user });
    })
}
