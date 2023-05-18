import { BetterClient } from "@template/lib"
import * as config from "@template/config"
import { DebugType, logger } from "@template/logger"

const client = new BetterClient({
	allowedMentions: { parse: ["users"] },
	intents: config.intents,
})

client.login().catch((error) => {
	logger.debug(JSON.stringify(config, null, 2), DebugType.GENERAL)
	logger.thrownError(error)
})

process.on("uncaughtException", (err) => {
	logger.thrownError(err)
})

