import { generateTimestamp } from "@template/functions"
import { TextCommand, BetterClient } from "@template/lib"
import { Message } from "discord.js"

export default class Restart extends TextCommand {
	constructor(client: BetterClient) {
		super("restart", client, {
			adminOnly: true,
		})
	}

	override async run(message: Message, args: string[]) {
		if (!args[0]) return message.reply("Please specify a shard type `all` to restart all shards.")

		if (!this.client.shard) return message.reply("This bot is not sharded.")
		const toRestart = args[0] === "all" ? "all" : args[0]
		if (toRestart !== "all" && parseInt(toRestart) > this.client.shard.count) return message.reply(`Invalid shard ID. The bot currently has ${this.client.shard.count} shard(s).`)

		if (!toRestart) return message.reply("Please specify a shard type `all` to restart all shards.")

		const msg = await message.reply(
			`Restarting ${
				toRestart !== "all" ? `shard ${toRestart}` : "all shards. This message will not update when the process is complete"
			}. This may take a while. Started ${generateTimestamp({
				timestamp: new Date(),
				type: "R",
			})}.`
		)

		if (toRestart === "all") {
			await this.client.shard.respawnAll()

			msg.edit("All shards have been restarted.")
		} else {
			this.client.shard
				.broadcastEval((toRestart) => {
					`if (this.client.shard.ids[0] === ${toRestart}) process.exit()`
				})
				.then(() => msg.edit(`Shard ${toRestart} has been restarted.`))
				.catch((err) => msg.edit(`An error occurred while restarting shard ${toRestart}: ${err}`))
		}
	}
}
