import { CloseEvent } from "discord.js"
import { EventHandler } from "@template/lib"
import { logger } from "@template/logger"

export default class ShardDisconnect extends EventHandler {
	override async run(event: CloseEvent, shardId: number) {
		logger.info(`Shard ${shardId} disconnected from the gateway with code ${event.code} and will not reconnect.`)
	}
}
