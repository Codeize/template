import { ApplicationCommand, BetterClient } from "@template/lib"
import { ChatInputCommandInteraction, Message } from "discord.js"

export default class Command extends ApplicationCommand {
	constructor(client: BetterClient) {
		super("ping", client, {
			description: "Check the bot's latency",
		})
	}

	override async run(interaction: ChatInputCommandInteraction) {
		const message = (await interaction.reply({
			content: "Ping?",
			fetchReply: true,
		})) as unknown as Message
		const hostLatency = message.createdTimestamp - interaction.createdTimestamp
		const apiLatency = Math.round(this.client.ws.ping)
		return interaction.editReply({
			content: `Pong! Host latency: ${hostLatency}ms. API latency: ${apiLatency}ms. Round trip latency: ${hostLatency + apiLatency}ms`,
		})
	}
}
