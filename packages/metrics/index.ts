import { logger } from "@template/logger"
import Fastify from "fastify"
import prom from "prom-client"
import db from "@template/database"

const server = Fastify({
	logger: false
})
server.get("/metrics", async (_req, res) => {
	try {
		const prismaMetrics = await db.$metrics.prometheus()
		const metrics = await prom.register.metrics()
		res.header("Content-Type", prom.contentType)
		res.send(`${metrics}\n${prismaMetrics}`)
	} catch (err) {
		res.status(500).send(err)
	}
})

server.get("*", (_req, res) => {
	res.redirect(301, "https://github.com/Codeize/template")
})

if (process.env.NODE_ENV === "production") {
	server.listen({ port: 6677, host: "0.0.0.0" }, (err) => {
		if (err) {
			logger.thrownError(err)
			process.exit(1)
		}
	})
} else if (process.env[`METRICS_PORT_${process.env.APP_NAME?.toUpperCase()}`]) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	server.listen({ port: parseInt(process.env[`METRICS_PORT_${process.env.APP_NAME?.toUpperCase()}`]!), host: "0.0.0.0" }, (err) => {
		if (err) {
			logger.thrownError(err)
			process.exit(1)
		}
		logger.info(`[METRICS] Listening on port ${process.env[`METRICS_PORT_${process.env.APP_NAME?.toUpperCase()}`]}`)
	})
} else {
	logger.warn(
		`[METRICS] Running in development mode. If you want to run the metrics server, provide a port for ${process.env.APP_NAME?.toUpperCase()} using the METRICS_PORT_${
			process.env.APP_NAME
		} environment variable.`
	)
}

export { prom }
export * from "./src/clientStats.js"
export * from "./src/commandStats.js"
export * from "./src/guildStats.js"