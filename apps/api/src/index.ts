import { logger } from "@template/logger"
import { getFiles, checkDBStatus } from "@template/functions"
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import metricsPlugin from "fastify-metrics"
import { pathToFileURL } from "url"

import Fastify from "fastify"
const app = Fastify({
	logger: false,
})
import cors from "@fastify/cors"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.register(cors)

app.register(fastifySwagger, {
	swagger: {
		info: {
			title: "Template API",
			description: "The API for Codeize's bot template",
			version: "0.0.1",
		},
		host: "localhost:3000",
		schemes: ["https"],
		consumes: ["application/json"],
		produces: ["application/json"],
		externalDocs: {
			url: "https://github.com/Codeize/template",
		},
		securityDefinitions: {
			apiKey: {
				type: "apiKey",
				name: "Authorization",
				in: "header",
			},
		},
		tags: [{ name: "v1/", description: "Misc V1 endpoints" }],
	},
})

app.register(async function (app) {
	app.get(
		"/",
		{
			schema: {
				description: "Check the status of the API",
				params: {},
				response: {
					200: {
						description: "Successful response indicating that the API is healthy",
						type: "object",
						properties: {
							message: {
								type: "string",
								description: "Successful response indicating that the API is healthy",
								example: "This maze wasn't meant for you...",
							},
							documentation: {
								type: "string",
								description: "A hint at the location of the API documentation",
								example: "/docs",
							},
						},
					},
					503: {
						description: "Unsuccessful response indicating that the API is experiencing issues",
						type: "string",
						example: "Internal Server Error",
					},
				},
			},
		},
		async (_req, _res) => {
			const dbStatus = await checkDBStatus()
			if (dbStatus) {
				return _res.status(200).send({ message: "This maze wasn't meant for you...", documentation: "/docs" })
			} else {
				return _res.status(503).send("Internal Server Error")
			}
		}
	)
})

const folders = getFiles(join(__dirname, "/"), "").filter((folder) => !folder.includes(".") && folder.startsWith("v"))
for await (const folder of folders) {
	logger.info(`Loading version ${folder}`)
	// eslint-disable-next-line no-await-in-loop
	const { routes, prefix } = await import(pathToFileURL(join(__dirname, `/${folder}/${folder}.js`)).href)
	app.register(routes, { prefix })
}

await app.register(fastifySwaggerUi, {
	routePrefix: "/docs",
})
await app.register(metricsPlugin, {
	endpoint: "/metrics",
})

app.listen({ port: parseInt(process.env.API_PORT || "3000"), host: "0.0.0.0" }, (err, address) => {
	if (err) {
		logger.thrownError(err)
		process.exit(1)
	}
	logger.info(`Server listening at ${address}`)
	app.swagger()
})
