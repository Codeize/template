import { ShardingManager } from "discord.js"
import { botName } from "@template/config"
import { logger } from "@template/logger"

const manager = new ShardingManager("./dist/src/bot/index.js", {
	token: process.env.DISCORD_TOKEN,
	totalShards: "auto",
})

logger.info(`Starting ${botName}`)

manager.on("shardCreate", (shard) => {
	logger.info(`Starting Shard ${shard.id}.`)
	if (shard.id + 1 === manager.totalShards) {
		shard.once("ready", () => {
			setTimeout(() => {
				logger.info("All shards have been started!")
			}, 200)
		})
	}
})

manager.spawn()
