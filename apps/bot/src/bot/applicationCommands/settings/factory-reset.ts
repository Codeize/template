import { colors } from "@template/config"
import { generateTimestamp } from "@template/functions"
import { ApplicationCommand, BetterClient } from "@template/lib"
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder } from "discord.js"

export default class Command extends ApplicationCommand {
	constructor(client: BetterClient) {
		super("factory-reset", client, {
			description: "Resets all settings for this server.",
		})
	}

	override async run(interaction: ChatInputCommandInteraction) {
		if (!interaction.guild) return interaction.reply({ content: "This command can only be used in a server.", ephemeral: true })
		if (interaction.user.id !== interaction.guild.ownerId)
			return interaction.reply({ content: "Only the server owner can use this command.", ephemeral: true })

		const confirmationEmbed = new EmbedBuilder()
			.setTitle("Confirmation Required")
			.setDescription(
				`Are you sure you want to factory reset this server's settings?
				This will delete all server settings along with any data we store of your server's members. This cannot be undone.\n\nThe confirmation button will be enabled ${generateTimestamp(
		{ timestamp: Date.now() + 11000, type: "R" } // Using 11 seconds to account for the time it takes to send the message.
	)}.`
			)
			.setColor(colors.error)

		const confirmationRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder().setCustomId("factoryReset:confirm").setLabel("Confirm").setStyle(ButtonStyle.Danger).setDisabled(true),
			new ButtonBuilder().setCustomId("factoryReset:cancel").setLabel("Cancel").setStyle(ButtonStyle.Secondary)
		)

		const message = await interaction.reply({
			embeds: [confirmationEmbed],
			components: [confirmationRow],
			fetchReply: true,
		})

		setTimeout(async () => {
			const msg = await interaction.channel?.messages.fetch(message.id)
			if (!msg?.components || message.components.length === 0) return

			confirmationEmbed.setDescription(
				`Are you sure you want to factory reset this server's settings?
				This will delete all server settings along with any data we store of your server's members. This cannot be undone.\n\nThe confirmation button is now enabled.`
			)
			const newRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
				confirmationRow.components[0].setDisabled(false),
				confirmationRow.components[1]
			)

			interaction.editReply({
				embeds: [confirmationEmbed],
				components: [newRow],
			})
		}, 10000)
	}
}
