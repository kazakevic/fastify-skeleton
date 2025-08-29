import type {FastifyInstance} from "fastify";

export default async function healthRoute(app: FastifyInstance) {
    app.get("/health", {
        schema: {
            description: "Health check endpoint",
            tags: ["Public"],
            response: {
                200: {
                    type: "object",
                    properties: {
                        status: { type: "string" }
                    },
                    required: ["status"],
                    additionalProperties: false
                }
            }
        }
    }, async () => ({ status: "ok" }));
}