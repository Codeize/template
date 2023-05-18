import { EventHandler } from "@template/lib"
import { logger } from "@template/logger"

export default class Warn extends EventHandler {
	override async run(info: string) {
		logger.warn(`Shard ${this.client.shard?.ids[0]} sent a warning: ${info}`)
	}
}
