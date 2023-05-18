import { GatewayIntentBits, PermissionsBitField, PermissionFlagsBits } from "discord.js"

const botName = "Codeize's Bot Template"
const botIcon = "https://cdn.discordapp.com/attachments/1081331606775676998/1081689096356888576/CodeizeBotTemplate.png"
const admins = ["668423998777982997", "456", "789"]

const colors = {
	primary: 0xd8833b,
	success: 0x57f287,
	warning: 0xfee75c,
	error: 0xed4245,
	invisible: 0x2f3136,
}

const intents = [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildWebhooks,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildMessageReactions,
]

const requiredPermissions = new PermissionsBitField([
	PermissionFlagsBits.EmbedLinks,
	PermissionFlagsBits.SendMessages,
	PermissionFlagsBits.UseExternalEmojis,
])

const embedSpacer = "https://cdn.discordapp.com/attachments/1081331606775676998/1081689279845126224/embed_spacer.png"

export { botName, botIcon, admins, colors, intents, requiredPermissions, embedSpacer }
