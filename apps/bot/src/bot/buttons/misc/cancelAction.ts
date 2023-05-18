import { Button, BetterClient } from "@template/lib"
import { ButtonInteraction } from "discord.js"

export default class EditEmbed extends Button {
	constructor(client: BetterClient) {
		super("cancelAction", client, {
			authorOnly: true,
		})
	}

	override async run(interaction: ButtonInteraction) {
		await interaction.deferUpdate()
		const msg = interaction.message
		msg.edit({
			content: "Action cancelled.",
			embeds: [],
			components: [],
			attachments: [],
		})
	}
}
