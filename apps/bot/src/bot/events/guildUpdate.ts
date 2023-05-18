import { EventHandler } from "@template/lib"
import db from "@template/database"
import { Guild } from "discord.js"

export default class GuildUpdate extends EventHandler {
	override async run(_oldGuild: Guild, newGuild: Guild) {
		await db.guild.upsert({
			where: {
				id: newGuild.id,
			},
			create: {
				id: newGuild.id,
				name: newGuild.name,
			},
			update: {
				name: newGuild.name,
			},
		})
	}
}
