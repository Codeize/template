import { botName, colors } from "@template/config"
import { deleteAllGuildSettings, deleteAllUserGuildData, markFactoryReset } from "@template/database"
import { generateTimestamp } from "@template/functions"
import { BetterClient, Button } from "@template/lib"
import { ButtonInteraction, EmbedBuilder } from "discord.js"

export default class ButtonBoi extends Button {
	constructor(client: BetterClient) {
		super("factoryReset", client, {
			authorOnly: false,
		})
	}

	override async run(interaction: ButtonInteraction) {
		if (!interaction.guild) return

		if (interaction.user.id !== interaction.guild.ownerId) {
			const notOwnerEmbed = new EmbedBuilder()
				.setTitle("You are not the owner of this server.")
				.setDescription("Only the server owner can use this command.")
				.setColor(colors.error)

			return interaction.reply({
				embeds: [notOwnerEmbed],
				ephemeral: true,
			})
		}

		const action = interaction.customId.split(":")[1]

		switch (action) {
			case "confirm": {
				const deletingEmbed = new EmbedBuilder()
					.setTitle("Data Deletion in Progress")
					.setDescription(
						`Please wait while ${botName} deletes all data for this server. This may take a while. Started ${generateTimestamp({
							timestamp: new Date(),
							type: "R",
						})}`
					)
					.setColor(colors.error)

				await interaction.update({
					embeds: [deletingEmbed],
					components: [],
				})

				await deleteAllUserGuildData(interaction.guild.id)

				await deleteAllGuildSettings(interaction.guild.id)

				const id = await markFactoryReset(interaction.guild.id, interaction.user.id).then((reset) => reset.id)

				const deletedEmbed = new EmbedBuilder()
					.setTitle("Data Deletion Complete")
					.setDescription("All data for this server has been deleted.")
					.setFooter({
						text: id,
					})
					.setColor(colors.success)

				await interaction.message.edit({
					embeds: [deletedEmbed],
				})

				break
			}
			case "cancel": {
				const cancelledEmbed = new EmbedBuilder()
					.setTitle("Data Deletion Cancelled")
					.setDescription("Data deletion has been cancelled successfully.")
					.setColor(colors.success)

				await interaction.update({
					embeds: [cancelledEmbed],
					components: [],
				})
				break
			}
		}
	}
}
