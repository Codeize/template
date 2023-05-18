import { EventHandler } from "@template/lib"
import { logger } from "@template/logger"

export default class ShardReconnecting extends EventHandler {
	override async run(shardId: number) {
		logger.info(`Shard ${shardId} is reconnecting to the gateway!`)
	}
}
