/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable guard-for-in */
import { Collection, ApplicationCommandData, CommandInteraction } from "discord.js"
import { BetterClient, ApplicationCommand, _BaseHandler, _BaseComponent, HandlerType } from "../../index.js"
import { logger } from "@template/logger"
import { generateErrorMessage } from "@template/functions"

export default class ApplicationCommandHandler extends _BaseHandler {
	// Key is `${userID}-${commandName}`.
	private cooldowns: Collection<string, number>

	constructor(client: BetterClient) {
		super(HandlerType.ApplicationCommand, client)
		this.cooldowns = new Collection()
	}

	public override postLoad() {
		return setTimeout(async () => {
			this.client.application?.commands.set(
				this.client.applicationCommands.map((command) => {
					const data = this.getDiscordCommandData(command)
					return data
				})
			)
			await Promise.all(
				this.client.guilds.cache.map((guild) =>
					guild.commands.set([]).catch((error) => {
						if (error.code === 50001) {
							logger.error(
								`I encountered DiscordAPIError: Missing Access in ${guild.name} [${guild.id}] when trying to set slash commands!`
							)
						} else {
							logger.thrownError(error)
						}
					})
				)
			)
		}, 5000)
	}

	private getDiscordCommandData(command: ApplicationCommand) {
		const data: ApplicationCommandData = {
			name: command.key,
			description: command.description || "",
			options: command.options,
		}

		// const data: ApplicationCommandData = {
		//     name: this.client.localeManager.getString("commands", `${command.key}_name`),
		//     nameLocalizations: {},
		//     description:
		//         this.client.localeManager.getString("commands", `${command.key}_description`) || "Failed to fetch description from translation data",
		//     descriptionLocalizations: {},
		//     options: [],
		// }
		// if (data.name.match(/String .+ not found/g)) data.name = command.key
		// command.options?.forEach((optionData) => {
		//     const newData = optionData
		//     const key = optionData.name
		//     newData.name = this.client.localeManager.getString("commands", `${command.key}_option_${key}_name`)
		//     if (newData.name.match(/String .+ not found/g)) newData.name = key
		//     newData.nameLocalizations = {}
		//     newData.description = this.client.localeManager.getString("commands", `${command.key}_option_${key}_description`)
		//     newData.descriptionLocalizations = {}
		//     const nameLocalizations = this.client.localeManager.getAllTranslations("commands", `${command.key}_option_${key}_name`) || {}
		//     const descriptionLocalizations =
		//         this.client.localeManager.getAllTranslations("commands", `${command.key}_option_${key}_description`) || {}
		//     for (const locale in nameLocalizations) {
		//         const newLocale = this.client.localeManager.convertDiscordLocale(locale, true)
		//         newData.nameLocalizations![newLocale as Locale] = nameLocalizations[locale]
		//     }
		//     for (const locale in descriptionLocalizations) {
		//         const newLocale = this.client.localeManager.convertDiscordLocale(locale, true)
		//         newData.descriptionLocalizations![newLocale as Locale] = descriptionLocalizations[locale]
		//     }
		//     data.options?.push(newData)
		// })

		// const nameLocalizations = this.client.localeManager.getAllTranslations("commands", `${command.key}_name`) || {}
		// const descriptionLocalizations = this.client.localeManager.getAllTranslations("commands", `${command.key}_description`) || {}
		// for (const locale in nameLocalizations) {
		//     const newLocale = this.client.localeManager.convertDiscordLocale(locale, true)
		//     data.nameLocalizations![newLocale as Locale] = nameLocalizations[locale]
		// }
		// for (const locale in descriptionLocalizations) {
		//     const newLocale = this.client.localeManager.convertDiscordLocale(locale, true)
		//     data.descriptionLocalizations![newLocale as Locale] = descriptionLocalizations[locale]
		// }

		return data
	}

	public override async specificChecks(interaction: CommandInteraction, component: _BaseComponent) {
		if (component.cooldown) {
			const cooldownKey = `${interaction.user.id}-${interaction.commandName}`
			const currentCooldown = this.cooldowns.get(cooldownKey)
			if (currentCooldown) {
				if (currentCooldown > Date.now()) {
					return interaction.reply(
						generateErrorMessage(
							{
								title: "You are on a cooldown!",
								description: `Try again <t:${Math.floor(currentCooldown / 1000)}:R>.`,
							},
							true
						)
					)
				}
				this.cooldowns.delete(cooldownKey)
			}
		}
	}
}
