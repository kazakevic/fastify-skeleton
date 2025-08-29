import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import type {FastifyReply, FastifyRequest} from "fastify";

export default fp(async (app) => {
    // Register JWT plugin
    app.register(fastifyJwt, {
        secret: process.env.JWT_SECRET || "supersecret", // 🔑 use env in prod
    });

    // Add decorator
    app.decorate(
        "authenticate",
        async function (request: FastifyRequest, reply: FastifyReply) {
            try {
                await request.jwtVerify();
            } catch (err) {
                reply.code(401).send(err);
            }
        }
    );
});

// Extend Fastify types
declare module "fastify" {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }

    interface FastifyRequest {
        currentUser: {
            id: number;
            username: string;
        } | null;
    }
}