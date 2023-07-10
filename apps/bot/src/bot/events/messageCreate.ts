import { Message } from "discord.js"
import { EventHandler } from "@template/lib"
import { messageSeen } from "@template/metrics"

export default class MessageCreate extends EventHandler {
	override async run(message: Message) {
		this.client.textCommandHandler.handle(message)

		if (message.guildId) messageSeen(message.guildId)
	}
}
