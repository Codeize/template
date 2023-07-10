import { Guild } from "discord.js"
import { Counter, Gauge } from "prom-client"

const guildMemberStats = new Gauge({
	name: "template_guild_member_stats",
	help: "Guild member stats",
	labelNames: ["guildId"]
})

const guildMessageStats = new Counter({
	name: "template_guild_message_stats",
	help: "Guild message stats",
	labelNames: ["guildId"]
})

export const updateGuildMemberCounts = (guild: Guild) => {
	guildMemberStats.set({ guildId: guild.id }, guild.memberCount)
}

export const messageSeen = (guildId: string) => {
	guildMessageStats.inc({ guildId })
}