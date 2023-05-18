import { parseUser } from "@template/functions"
import { TextCommand, BetterClient } from "@template/lib"
import { Message } from "discord.js"

export default class Sudo extends TextCommand {
	constructor(client: BetterClient) {
		super("sudo", client, {
			adminOnly: true,
		})
	}

	override async run(message: Message, args: string[]) {
		if (args[0]) {
			const user = await parseUser(args[0], this.client)
			if (!user) return message.channel.send("Invalid user")

			this.client.sudo.set(message.author.id, user.id)

			message.reply(`Sudoing ${user.tag}`)
		} else {
			this.client.sudo.delete(message.author.id)
			message.reply("Stopped sudo")
		}
	}
}
