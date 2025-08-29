import type {FastifyInstance} from "fastify";
import {v7} from "uuid";
import {hashPassword} from "../../utils/passHashAdapter.js";

export default async function registerRoute(app: FastifyInstance) {
    const opts = {
        schema: {
            tags: ["Public", "Auth"],
            body: {
                type: "object",
                properties: {
                    username: { type: "string" },
                    email: { type: "string" },
                    password: { type: "string" }
                },
                required: ["username", "email", "password"],
                additionalProperties: false
            },
            response: {
                201: {
                    type: "object",
                    properties: {
                        user: {
                            type: "object",
                            properties: {
                                username: { type: "string" },
                                email: { type: "string" },
                                uuid: { type: "string" }
                            },
                            required: ["username", "email", "uuid"],
                            additionalProperties: false
                        }
                    },
                    additionalProperties: false
                },
                410: {
                    type: "object",
                    properties: {
                        error: {type: "string"}
                    },
                    required: ["error"],
                    additionalProperties: false
                }
            }
        }
    }

    app.post("/api/public/register", opts, async (request, reply) => {
        const username = (request.body as { username: string }).username;
        const password = (request.body as { password: string }).password;
        const passwordHash = hashPassword(password);
        const email = (request.body as { email: string }).email;

        const existingUser = await app.prisma.user.findFirst({
            where: { email }
        });

        if (existingUser) {
            reply.status(410).send({ error: `Username ${username} already exists` });
            return;
        }

        const user = await app.prisma.user.create({
            data: {
                username,
                uuid: v7(),
                email: email,
                password: await passwordHash
            }
        });

        reply.status(201).send({
            user: {
                username: user.username,
                email: user.email,
                uuid: user.uuid
            }
        });
    });
}