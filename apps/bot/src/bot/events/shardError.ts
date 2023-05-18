import { EventHandler } from "@template/lib"
import { logger } from "@template/logger"

export default class ShardError extends EventHandler {
	override async run(error: Error, _shardId: number) {
		logger.thrownError(error, { shard: _shardId })
	}
}
