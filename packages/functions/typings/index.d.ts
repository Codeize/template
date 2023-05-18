import { APIEmbed, ActionRowBuilder, ButtonBuilder } from "discord.js"

export interface GeneratedMessage {
	embeds?: APIEmbed[]
	components?: ActionRowBuilder<ButtonBuilder>[]
	ephemeral?: boolean
	content?: string
}
