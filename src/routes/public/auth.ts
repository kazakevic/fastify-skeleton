import type {FastifyInstance} from "fastify";
import {comparePassword} from "../../utils/passHashAdapter.js";

export default async function loginRoute(app: FastifyInstance) {
    const opts = {
        schema: {
            body: {
                type: "object",
                required: ["username", "password"],
                properties: {
                    username: {type: "string"},
                    password: {type: "string"}
                }
            }
        },
        responses: {
            200: {
                type: "object",
                properties: {
                    id: {type: "string"},
                    access_token: {type: "string"},
                    expires_in: {type: "number"}
                }
            },
            401: {
                type: "object",
                properties: {
                    error: {type: "string"}
                }
            }
        }
    }

    app.post("/api/public/auth", opts, async (request, reply) => {
        //extract username password from  application/x-www-form-urlencoded
        const body = request.body as { username: string; password: string };
        const username: string = body.username;
        const password: string = body.password;

        const user = await app.prisma.user.findUnique({
            where: { email: username }
        });

        if (!user) {
            return reply.status(401).send({ error: "Unauthorized" });
        }

        const passwordMatch: boolean = await comparePassword(password, user.password);

        if (!passwordMatch) {
            return reply.status(401).send({ error: "Unauthorized" });
        }

        // Sign a JWT
        const token = app.jwt.sign(
            { id: user.uuid, username: user.username },
            { expiresIn: "15m" }
        );

        return {
            access_token: token,
            expires_in: 60 * 15,
            id: user.uuid,
        };
    });
}
