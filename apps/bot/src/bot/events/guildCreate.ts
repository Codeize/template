import { EventHandler } from "@template/lib"
import { logger } from "@template/logger"
import db from "@template/database"
import { Guild } from "discord.js"
import { updateClientStats } from "@template/metrics"

export default class GuildCreate extends EventHandler {
	override async run(guild: Guild) {
		logger.info(`Joined guild ${guild.name} (${guild.id}) with ${guild.memberCount} members!`)

		await db.guild.upsert({
			where: {
				id: guild.id,
			},
			create: {
				id: guild.id,
				name: guild.name,
			},
			update: {
				name: guild.name,
			},
		})

		updateClientStats(this.client)
	}
}
