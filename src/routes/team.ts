import type {FastifyInstance} from "fastify";
import {v7} from "uuid";

export default async function teamRoute(app: FastifyInstance) {
    const createTeamOpts = {
        schema: {
            tags: ["Teams"],
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

    const listTeamsOpts = {
        schema: {
            tags: ["Teams"],
        },
        preHandler: [app.authenticate]
    }

    app.get("/api/v1/teams", listTeamsOpts, async (request, reply) => {
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
            tags: ["Teams", "TeamMembers"],
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
            uuid: v7(),
            teamId: teamId
        }

        await app.prisma.teamMember.create({
            data: member
        });

        reply.code(201).send({
            member
        })
    })

    const deleteTeamOpts = {
        schema: {
            tags: ["Teams"],
        },
        preHandler: [app.authenticate]
    }

    app.delete("/api/v1/teams/:teamId", deleteTeamOpts, async (request, reply) => {
        const teamId = (request.params as { teamId: string }).teamId

        const ownerId = (request.user as { id: string }).id

        const team = await app.prisma.team.findUnique({
            where: { uuid: teamId }
        })

        if (!team) {
            return reply.code(404).send({ message: "Team not found" })
        }

        if (team.ownerId !== ownerId) {
            return reply.code(403).send({ message: "You are not the owner of this team" })
        }

        // Delete all team members and their attributes
        const members = await app.prisma.teamMember.findMany({
            where: { teamId }
        })

        // for (const member of members) {
        //     await app.prisma.teamMemberAttribute.deleteMany({
        //         where: { teamMemberId: member.uuid }
        //     })
        // }

        await app.prisma.teamMember.deleteMany({
            where: { teamId }
        })

        // Delete the team
        await app.prisma.team.delete({
            where: { uuid: teamId }
        })

        reply.code(204).send()
    })

    const listTeamMemberOpts = {
        schema: {
            tags: ["Teams", "TeamMembers"],
        },
        preHandler: [app.authenticate]
    }

    app.get("/api/v1/teams/:teamId/members", listTeamMemberOpts, async (request, reply) => {
        const teamId = (request.params as { teamId: string }).teamId

        const members = await app.prisma.teamMember.findMany({
            where: { teamId },
            include: {
                attributes: true
            }
        })

        reply.code(200).send({
            "members": members
        })
    })

    const deleteTeamMemberOpts = {
        schema: {
            tags: ["TeamMembers"],
        },
        preHandler: [app.authenticate]
    }

    app.delete("/api/v1/teams/members/:memberId", deleteTeamMemberOpts, async (request, reply) => {
        const memberId = (request.params as { memberId: string }).memberId

        const member = await app.prisma.teamMember.findUnique({
            where: { uuid: memberId }
        })

        if (!member) {
            return reply.code(404).send({ message: "Team member not found" })
        }

        // Delete all attributes associated with the member

        await app.prisma.teamMemberAttribute.deleteMany({
            where: { teamMemberId: member.id }
        })

        await app.prisma.teamMember.delete({
            where: { uuid: memberId }
        })

        reply.code(204).send()
    })

    const addAttributeOpts = {
        schema: {
            tags: ["TeamMembers"],
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

        const member = await app.prisma.teamMember.findUnique({
            where: { uuid: teamMemberId }
        })

        if (!member) {
            return reply.code(404).send({ message: "Team member not found" })
        }

        const attribute = {
            key: (request.body as { key: string }).key,
            value: (request.body as { value: string }).value,
            teamMemberId: member.id
        }

        await app.prisma.teamMemberAttribute.upsert({
            where: {
                teamMemberId_key: {
                    teamMemberId: member.id,
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

    const listAttributesOpts = {
        schema: {
            tags: ["TeamMembers"],
        },
        preHandler: [app.authenticate]
    }

    app.get("/api/v1/teams/member/:memberId/attributes", listAttributesOpts, async (request, reply) => {
        const teamMemberId = (request.params as { memberId: string }).memberId

        const member = await app.prisma.teamMember.findUnique({
            where: { uuid: teamMemberId }
        })

        if (!member) {
            return reply.code(404).send({ message: "Team member not found" })
        }

        const attributes = await app.prisma.teamMemberAttribute.findMany({
            where: {
                teamMemberId: member.id
            }
        })

        reply.code(200).send({
            "attributes": attributes
        })
    })
}
