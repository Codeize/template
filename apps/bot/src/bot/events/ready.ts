import database from "@template/database"
import { getFiles } from "@template/functions"
import { BetterClient, EventHandler } from "@template/lib"
import { logger } from "@template/logger"
import path from "path"

export default class Ready extends EventHandler {
	override async run() {
		await this.client.application?.fetch()
		const allGuilds = await this.client.shard?.broadcastEval(async (c) =>
			c.guilds.cache.map((guild) => `${guild.name} [${guild.id}] - ${guild.memberCount} members.`)
		)
		const guildsStringList: string[] = []
		// @ts-ignore
		for (let i = 0; i < allGuilds.length; i++) {
			// @ts-ignore
			guildsStringList.push(`Shard ${i + 1}\n${allGuilds[i].join("\n")}`)
		}
		// const stats = await this.client.fetchStats()
		logger.info(`Logged in as ${this.client.user?.tag} [${this.client.user?.id}] with ${this.client.shard?.count} shards.`) // with ${stats.guilds} guilds and ${stats.users} users.`)

		loadAndStartCrons(this.client)

		if (process.env.NODE_ENV === "development") {
			this.client.guilds.cache.forEach(async (x) => {
				await database.guild.upsert({
					where: {
						id: x.id,
					},
					update: {
						name: x.name,
					},
					create: {
						id: x.id,
						name: x.name,
					},
				})
			})
		}
	}
}

async function loadAndStartCrons(client: BetterClient) {
	try {
		const cronJobsPath = path.join(client.__dirname, "src", "bot", "jobs")
		const cronJobFileNames = getFiles(cronJobsPath, "js", true)

		await Promise.all(
			cronJobFileNames.map(async (cronJobFileName) => {
				try {
					const filePath = path.join(cronJobsPath, cronJobFileName)
					const fileUrl = `file://${filePath.replace(/\\/g, "/")}`

					const { startCron } = await import(fileUrl)
					startCron(client)
					logger.info(`[CRON] Loaded cron job ${cronJobFileName}`)
				} catch (error) {
					logger.error(`[CRON] Failed to load cron job: ${cronJobFileName} - ${error}`)
				}
			})
		)
	} catch (e) {
		logger.warn(`[CRON] Failed to load files for cron job handler: ${e}`)
	}
}
