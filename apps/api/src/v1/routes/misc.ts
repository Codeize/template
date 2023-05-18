import { FastifyPluginCallback, FastifyRequest } from "fastify"

export const routes: FastifyPluginCallback = (fastify, _opts, done) => {
	type GuildIdParam = { guildId: string | undefined }

	fastify.get(
		"/ping",
		{
			schema: {
				description: "Check the status of the API",
				tags: ["v1/"],
				response: {
					200: {
						description: "Successful response returning a message that the heartbeat was acknowledged",
						type: "object",
						properties: {
							message: {
								type: "string",
								description: "Successful response returning a message that the heartbeat was acknowledged",
								example: "Pong! Heartbeat acknowledged.",
							},
						},
					},
					500: {
						description: "Internal Server Error",
						type: "string",
						example: "Internal Server Error",
					},
				},
			},
		},
		async (_request: FastifyRequest<{ Params: GuildIdParam }>) => {
			return { message: "Pong! Heartbeat acknowledged." }
		}
	)

	done()
}
