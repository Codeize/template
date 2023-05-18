import { EventHandler } from "@template/lib"
import { logger } from "@template/logger"

export default class Err extends EventHandler {
	override async run(error: Error) {
		logger.thrownError(error)
	}
}
