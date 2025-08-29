import type {FastifyInstance} from "fastify";

export default async function userRoute(app: FastifyInstance) {

    const opts = {
        schema: {
            tags: ["User"],
            response: {
                200: {
                    type: "object",
                    properties: {
                        user: {
                            type: "object",
                            properties: {
                                uuid: { type: "string" },
                                username: { type: "string" },
                                email: { type: "string" }
                            },
                            required: ["uuid", "username", "email"],
                            additionalProperties: false
                        }
                    },
                    additionalProperties: false
                },
                401: {
                    type: "object",
                    properties: {
                        error: { type: "string" }
                    },
                    required: ["error"],
                    additionalProperties: false
                },
                404: {
                    type: "object",
                    properties: {
                        error: { type: "string" }
                    },
                    required: ["error"],
                    additionalProperties: false
                }
            }
        },
        preHandler: [app.authenticate]
    }

    app.get("/api/v1/user/info", opts, async (request, reply) => {
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
