export * from "./src/generateMessage.js"
export * from "./src/generateTimestamp.js"
export * from "./src/getFiles.js"
export * from "./src/checkDBStatus.js"
export * from "./src/getPermissionName.js"
export * from "./src/isAdmin.js"
export * from "./src/parseUser.js"
export * from "./src/randomInt.js"
export * from "./src/titleCase.js"
export * from "./src/uploadHaste.js"
export * from "./src/shouldAllowImport.js"

import { APIEmbed, ActionRowBuilder, ButtonBuilder } from "discord.js"

export interface GeneratedMessage {
	embeds?: APIEmbed[]
	components?: ActionRowBuilder<ButtonBuilder>[]
	ephemeral?: boolean
	content?: string
}
