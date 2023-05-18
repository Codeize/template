import { logger } from "@template/logger"
import { getFiles } from "@template/functions"
import { join, dirname } from "path"
import { pathToFileURL, fileURLToPath } from "url"
import { FastifyPluginCallback } from "fastify"

export const prefix = "v1"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const routeNames = getFiles(join(__dirname, "routes"), "js")
const routesToRegister: Array<FastifyPluginCallback> = []
for (const route of routeNames) {
	const routePath = join(__dirname, "routes", route)
	logger.info(`Loading route ${prefix}/${route}`)

	const routeURL = pathToFileURL(routePath)
	const { routes } = await import(routeURL.href)

	routesToRegister.push(routes)
}

export const routes: FastifyPluginCallback = (fastify, _opts, done) => {
	for (const routesFile of routesToRegister) {
		fastify.register(routesFile)
	}

	done()
}
