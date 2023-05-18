import { Guild } from "discord.js"
import { EventHandler } from "@template/lib"
import { logger } from "@template/logger"

export default class GuildDelete extends EventHandler {
	override async run(guild: Guild) {
		logger.info(`Left guild ${guild.name} (${guild.id}) with ${guild.memberCount} members!`)
	}
}
