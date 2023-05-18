/* eslint-disable no-unused-vars */
import * as config from "@template/config"
import { TextCommand, BetterClient, StopWatch, Type } from "@template/lib"
import { logger, DebugType } from "@template/logger"
import { Message, EmbedBuilder } from "discord.js"
import { inspect } from "util"
import db from "@template/database"
import * as database from "@template/database"
import * as experiments from "@template/experiments"
import * as i18n from "@template/i18n"
import * as lib from "@template/lib"
import * as functions from "@template/functions"
const template = { db, database, experiments, i18n, config, lib, functions, logger: { logger, DebugType } }

export default class Eval extends TextCommand {
	constructor(client: BetterClient) {
		super("eval", client, {
			adminOnly: true,
		})

		logger.null(template)
	}

	override async run(message: Message, args: string[]) {
		logger.info(`${message.author.tag} ran eval in ${message.guild?.name} ${message.guild?.id}, ${args.join(" ")}`)
		logger.null(`${DebugType.GENERAL}`)

		const { success, result, time, type } = await this.eval(message, args.join(" "))
		if (message.content.includes("--silent")) return null

		if (result.length > 4087) {
			return message.reply({
				embeds: [
					new EmbedBuilder({
						title: success ? "🆗 Evaluated successfully." : "🆘 JavaScript failed.",
						description: `Output too long for Discord, view it [here](${await functions.uploadHaste(result, "js")})`,
						fields: [
							{
								name: "Type",
								value: `\`\`\`ts\n${type}\`\`\`\n${time}`,
							},
						],
						color: success ? config.colors.success : config.colors.error,
					}),
				],
			})
		}

		return message.reply({
			embeds: [
				new EmbedBuilder({
					title: success ? "🆗 Evaluated successfully." : "🆘 JavaScript failed.",
					description: `\`\`\`js\n${result}\`\`\``,
					fields: [
						{
							name: "Type",
							value: `\`\`\`ts\n${type}\`\`\`\n${time}`,
						},
					],
					color: success ? config.colors.success : config.colors.error,
				}),
			],
		})
	}

	private async eval(message: Message, codeInput: string) {
		// eslint-disable-next-line prefer-destructuring, no-unused-vars
		// if (message.id === user.id) {
		//     logger.info("Eval has been executed")
		// }
		let code = codeInput.replace(/[“”]/g, "\"").replace(/[‘’]/g, "'")
		const stopwatch = new StopWatch()
		let success
		let syncTime
		let asyncTime
		let result
		let thenable = false
		let type
		try {
			if (message.content.includes("--async")) code = `(async () => {\n${code}\n})();`
			// eslint-disable-next-line no-eval
			result = eval(code)
			syncTime = stopwatch.toString()
			type = new Type(result)
			if (this.isThenable(result)) {
				thenable = true
				stopwatch.restart()
				result = await result
				asyncTime = stopwatch.toString()
				type.addValue(result)
			}
			success = true
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			if (!syncTime) syncTime = stopwatch.toString()
			if (!type) type = new Type(error)
			if (thenable && !asyncTime) asyncTime = stopwatch.toString()
			if (error && error.stack) this.client.emit("error", error.stack)
			result = error
			success = false
		}

		stopwatch.stop()
		return {
			success,
			type,
			time: this.formatTime(syncTime, asyncTime),
			result: this.parseContent(inspect(result)),
		}
	}

	/**
	 * Parse the content of a string to remove all private information.
	 * @param content - The content to parse.
	 * @returns The parsed content.
	 */
	private parseContent(content: string): string {
		return content.replace(this.client.token || "", "[ T O K E N ]")
	}

	private formatTime(syncTime: string, asyncTime?: string) {
		return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private isThenable(input: any): boolean {
		if (!input) return false
		return input instanceof Promise || (input !== Promise.prototype && this.isFunction(input.then) && this.isFunction(input.catch))
	}

	public isFunction(input: unknown): boolean {
		return typeof input === "function"
	}
}
