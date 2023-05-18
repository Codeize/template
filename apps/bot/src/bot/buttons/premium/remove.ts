import { generateErrorMessage, generateSuccessMessage, generateTimestamp } from "@template/functions"
import { BetterClient, Button } from "@template/lib"
import { deactivateSlot } from "@template/premium"
import { ButtonInteraction } from "discord.js"

export default class Buttony extends Button {
	constructor(client: BetterClient) {
		super("premiumRemove", client, {
			authorOnly: true,
		})
	}

	override async run(interaction: ButtonInteraction) {
		if (!interaction.guild) return
		const [, args] = interaction.customId.split(":")
		const [slotId] = args.split(",")

		const slot = await deactivateSlot(slotId)
		if (!slot) {
			return interaction.update(
				generateErrorMessage(
					{
						title: "Deactivate Failure",
						description: `Unable to deactivate a guild in slot ${slotId}.`,
					},
					true
				)
			)
		} else {
			return interaction.update(
				generateSuccessMessage({
					title: "Slot Deactivated",
					description: `The slot has now been removed from that server.\nSlot ID: ${slotId}\nExpires: ${generateTimestamp({
						timestamp: slot.expiresAt,
						type: "R",
					})}`,
				})
			)
		}
	}
}
