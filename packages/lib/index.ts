export { default as _BaseComponent } from "./src/classes/_BaseComponent.js"
export { default as _BaseHandler } from "./src/classes/_BaseHandler.js"
export { default as ApplicationCommand } from "./src/classes/ApplicationCommand.js"
export { default as ApplicationCommandHandler } from "./src/classes/ApplicationCommandHandler.js"
export { default as AutoCompleteHandler } from "./src/classes/AutoCompleteHandler.js"
export { default as Button } from "./src/classes/Button.js"
export { default as ButtonHandler } from "./src/classes/ButtonHandler.js"
export { default as Debugger } from "./src/classes/Debugger.js"
export { default as Dropdown } from "./src/classes/Dropdown.js"
export { default as DropdownHandler } from "./src/classes/DropdownHandler.js"
export { default as EventHandler } from "./src/classes/EventHandler.js"
export { default as ModalSubmit } from "./src/classes/ModalSubmit.js"
export { default as ModalSubmitHandler } from "./src/classes/ModalSubmitHandler.js"
export { default as StopWatch } from "./src/classes/StopWatch.js"
export { default as TextCommand } from "./src/classes/TextCommand.js"
export { default as TextCommandHandler } from "./src/classes/TextCommandHandler.js"
export { default as Type } from "./src/classes/Type.js"
export { default as BetterClient } from "./src/extensions/BetterClient.js"

// --------------------- Typings ----------------------------

import { ApplicationCommandOptionData, ApplicationCommandType, PermissionsBitField } from "discord.js"

export interface BaseComponentOptions {
	dotPerm?: string
	permissions?: PermissionsBitField
	clientPermissions?: PermissionsBitField
	adminOnly?: boolean
	guildOnly?: boolean
	ownerOnly?: boolean
	cooldown?: number
	featureKey?: string
	userPremium?: boolean
	guildPremium?: boolean
	authorOnly?: boolean
}

export interface ApplicationCommandOptions extends BaseComponentOptions {
	description: string
	options?: ApplicationCommandOptionData[]
	type?: ApplicationCommandType
}
export type ButtonOptions = BaseComponentOptions
export type DropdownOptions = BaseComponentOptions
export type TextCommandOptions = Pick<BaseComponentOptions, "dotPerm" | "adminOnly">

export enum HandlerType {
	ApplicationCommand = "applicationCommands",
	Button = "buttons",
	Dropdown = "dropdowns",
	TextCommand = "textCommands",
}
