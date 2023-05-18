import { colors } from "@template/config"
import { generateWarningMessage } from "@template/functions"
import { BetterClient, ApplicationCommand } from "@template/lib"
import { getMemberSlots, slotInfoFormat } from "@template/premium"
import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	AutocompleteFocusedOption,
	AutocompleteInteraction,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	EmbedBuilder,
} from "discord.js"

export default class Command extends ApplicationCommand {
	constructor(client: BetterClient) {
		super("premium", client, {
			description: "Manage your premium status",
			guildOnly: true,
			options: [
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "view",
					description: "View your premium slots",
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "activate",
					description: "Activate a premium slot",
					options: [
						{
							type: ApplicationCommandOptionType.String,
							name: "slot_to_activate",
							description: "The slot to use",
							required: true,
							autocomplete: true,
						},
						{
							type: ApplicationCommandOptionType.String,
							name: "guild",
							description: "The guild ID to activate (defaults to the current guild)",
							required: false,
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "deactivate",
					description: "Deactivate a premium slot",
					options: [
						{
							type: ApplicationCommandOptionType.String,
							name: "slot_to_deactivate",
							description: "The slot to deactivate",
							required: true,
							autocomplete: true,
						},
					],
				},
			],
		})
	}

	override async run(interaction: ChatInputCommandInteraction) {
		if (!interaction.guild) return
		await interaction.deferReply()
		const subcommand = interaction.options.getSubcommand()
		switch (subcommand) {
			case "view": {
				const slots = await getMemberSlots(interaction.user.id)
				const slotData = await Promise.all(slots.map(async (x) => `${await slotInfoFormat(x)}`))
				const embed = new EmbedBuilder()
					.setTitle("Premium Slots")
					.setDescription(`You have ${slots.length} premium slots.\n${slotData.join("\n")}`)
					.setColor(colors.success)
				return interaction.editReply({ embeds: [embed] })
			}
			case "activate": {
				const slotId = interaction.options.getString("slot_to_activate", true)
				const guildId = interaction.options.getString("guild", false) || interaction.guild.id
				const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
					new ButtonBuilder().setCustomId(`premiumAdd:${slotId},${guildId}`).setLabel("Continue").setStyle(ButtonStyle.Primary),
					new ButtonBuilder().setCustomId("cancelAction").setLabel("Cancel").setStyle(ButtonStyle.Secondary),
				])
				return interaction.editReply(
					generateWarningMessage(
						{
							title: "Confirmation Required",
							description: `Are you sure you want to activate the premium slot \`${slotId}\` on guild \`${
								`${this.client.guilds.resolve(guildId)?.name} (${guildId})` || guildId
							}\`?`,
						},
						[row]
					)
				)
			}
			case "deactivate": {
				const slotId = interaction.options.getString("slot_to_deactivate", true)
				const slots = await getMemberSlots(interaction.user.id)
				const theSlot = slots.find((x) => x.id === slotId)
				if (!theSlot) return interaction.editReply("Unknown slot.")
				if (!(theSlot.guild && theSlot.guildId)) return interaction.editReply("This slot is not activated.")
				const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
					new ButtonBuilder().setCustomId(`premiumRemove:${slotId}`).setLabel("Deactivate Slot").setStyle(ButtonStyle.Danger),
					new ButtonBuilder().setCustomId("cancelAction").setLabel("Cancel").setStyle(ButtonStyle.Secondary),
				])
				return interaction.editReply(
					generateWarningMessage(
						{
							title: "Confirmation Required",
							description: `Are you sure you want to deactivate the premium slot \`${slotId}\` on guild \`${theSlot.guild.name} (${theSlot.guildId})\`?`,
						},
						[row]
					)
				)
			}
		}
	}

	override async autocomplete(interaction: AutocompleteInteraction, focused: AutocompleteFocusedOption) {
		const slots = await getMemberSlots(interaction.user.id)
		switch (focused.name) {
			case "slot_to_activate":
				return interaction.respond(
					slots.filter((x) => x.guild === null).map((x) => ({ name: `Unused Slot - Expires: ${new Date(x.expiresAt)}`, value: x.id }))
				)

			case "slot_to_deactivate":
				const result = await Promise.all(
					slots
						.filter((x) => x.guild !== null)
						.map(async (x) => ({
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							name: `${this.client.guilds.resolve(x.guild!.id)?.name || x.guild!.id} - Expires: ${new Date(x.expiresAt)}`,
							value: x.id,
						}))
				)
				return interaction.respond(result)
		}
	}
}
