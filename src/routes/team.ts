import type {FastifyInstance} from "fastify";
import {v7} from "uuid";

export default async function teamRoute(app: FastifyInstance) {
    const createTeamOpts = {
        schema: {
            body: {
                type: "object",
                properties: {
                    name: { type: "string" },
                },
                required: ["name"],
                additionalProperties: false
            }
        },
        preHandler: [app.authenticate]
    }

    app.post("/api/v1/teams", createTeamOpts, async (request, reply) => {
        const team = {
            name: (request.body as { name: string }).name,
            uuid: v7(),
            ownerId: (request.user as { id: string }).id
        }

        await app.prisma.team.create({
            data: team
        })

        reply.code(201).send({
            team
        })
    })

    app.get("/api/v1/teams", {preHandler: [app.authenticate]}, async (request, reply) => {
        const ownerId = (request.user as { id: string }).id

        const teams = await app.prisma.team.findMany({
            where: { ownerId }
        })

        reply.code(200).send({
            "teams": teams
        })
    })

    const addTeamMemberOpts = {
        schema: {
            body: {
                type: "object",
                properties: {
                    name: { type: "string"},
                },
                required: ["name"],
                additionalProperties: false
            }
        },
        preHandler: [app.authenticate]
    }

    app.post("/api/v1/teams/:teamId/members", addTeamMemberOpts, async (request, reply) => {
        const teamId = (request.params as { teamId: string }).teamId

        const member = {
            name: (request.body as { name: string }).name,
            teamId: teamId
        }

        await app.prisma.teamMember.create({
            data: member
        });

        reply.code(201).send({
            member
        })
    })

    app.get("/api/v1/teams/:teamId/members", {preHandler: [app.authenticate]}, async (request, reply) => {
        const teamId = (request.params as { teamId: string }).teamId

        const members = await app.prisma.teamMember.findMany({
            where: { teamId }
        })

        reply.code(200).send({
            "members": members
        })
    })

    const addAttributeOpts = {
        schema: {
            body: {
                type: "object",
                properties: {
                    key: { type: "string" },
                    value: { type: "string" }
                },
                required: ["key", "value"],
                additionalProperties: false
            }
        },
        preHandler: [app.authenticate]
    }

    app.put("/api/v1/teams/member/:memberId/attributes", addAttributeOpts, async (request, reply) => {
        const teamMemberId = (request.params as { memberId: string }).memberId

        const attribute = {
            key: (request.body as { key: string }).key,
            value: (request.body as { value: string }).value,
            teamMemberId: teamMemberId
        }

        await app.prisma.teamMemberAttribute.upsert({
            where: {
                teamMemberId_key: {
                    teamMemberId: teamMemberId,
                    key: attribute.key
                }
            },
            update: {
                value: attribute.value
            },
            create: attribute
        })

        reply.code(201).send({
            attribute
        })
    })

    app.get("/api/v1/teams/member/:memberId/attributes", {preHandler: [app.authenticate]}, async (request, reply) => {
        const teamMemberId = (request.params as { memberId: string }).memberId

        const attributes = await app.prisma.teamMemberAttribute.findMany({
            where: { teamMemberId }
        })

        reply.code(200).send({
            "attributes": attributes
        })
    })
}
