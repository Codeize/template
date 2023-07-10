import { Counter } from "prom-client"

const commandGuildUsage = new Counter({
	name: "template_command_guild_usage",
	help: "Command guild usage",
	labelNames: ["command", "guildId"]
})

const commandUserUsage = new Counter({
	name: "template_command_user_usage",
	help: "Command user usage",
	labelNames: ["command", "userId"]
})

export const commandTriggered = (data: { command: string; guildId?: string | null; userId: string }) => {
	if (data.guildId) commandGuildUsage.inc({ command: data.command, guildId: data.guildId })
	commandUserUsage.inc({ command: data.command, userId: data.userId })
}