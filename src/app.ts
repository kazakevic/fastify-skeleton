import Fastify, {type FastifyReply, type FastifyRequest} from "fastify";
import healthRoute from "./routes/health.js";
import userRoute from "./routes/users.js";
import prismaPlugin from "./plugins/prisma.js";
import loginRoute from "./routes/public/auth.js";
import registerRoute from "./routes/public/register.js";
import auth from "./plugins/auth.js";
import formBody from "@fastify/formbody";
import teamRoute from "./routes/team.js";


export default function buildApp() {
    const app = Fastify({ logger: true });

    app.register(prismaPlugin);
    app.register(auth);
    app.register(formBody);

    // Register routes
    app.register(healthRoute);
    app.register(userRoute);
    app.register(loginRoute);
    app.register(registerRoute);

    app.register(teamRoute);

    return app;
}