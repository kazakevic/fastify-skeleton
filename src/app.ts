import Fastify from "fastify";
import healthRoute from "./routes/health.js";
import userRoute from "./routes/users.js";
import prismaPlugin from "./plugins/prisma.js";
import loginRoute from "./routes/public/auth.js";
import registerRoute from "./routes/public/register.js";
import auth from "./plugins/auth.js";
import formBody from "@fastify/formbody";
import teamRoute from "./routes/team.js";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export default function buildApp() {
    const app = Fastify({ logger: true });

    app.register(prismaPlugin);
    app.register(auth);
    app.register(formBody);

    // Register Swagger/OpenAPI
    app.register(swagger, {
        openapi: {
            info: {
                title: "Simple team management API",
                description: "",
                version: "1.0.0",
            },
        },
    });

    // Register routes
    app.register(healthRoute);
    app.register(userRoute);
    app.register(loginRoute);
    app.register(registerRoute);

    app.register(teamRoute);

    app.register(swaggerUi, {
        routePrefix: "/docs", // 👉 docs available at http://localhost:3000/docs
    });

    return app;
}