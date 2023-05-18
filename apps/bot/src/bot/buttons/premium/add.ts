import { generateErrorMessage, generateSuccessMessage, generateTimestamp } from "@template/functions"
import { BetterClient, Button } from "@template/lib"
import { activateSlot } from "@template/premium"
import { ButtonInteraction } from "discord.js"

export default class Buttony extends Button {
	constructor(client: BetterClient) {
		super("premiumAdd", client, {
			authorOnly: true,
		})
	}

	override async run(interaction: ButtonInteraction) {
		if (!interaction.guild) return
		const [, args] = interaction.customId.split(":")
		const [slotId, guildId] = args.split(",")

		const slot = await activateSlot(slotId, guildId)
		if (!slot) {
			return interaction.update(
				generateErrorMessage(
					{
						title: "Activation Failure",
						description: `Unable to activate a guild in slot ${slotId}.`,
					},
					true
				)
			)
		} else {
			return interaction.update(
				generateSuccessMessage({
					title: "Slot Activated",
					description: `This server has now been activated with a premium slot.\nUser: ${
						interaction.user.tag
					}\nSlot ID: ${slotId}\nExpires: ${generateTimestamp({ timestamp: slot.expiresAt, type: "R" })}`,
				})
			)
		}
	}
}
