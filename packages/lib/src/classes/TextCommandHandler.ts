import { BetterClient, TextCommand } from "../../index.js"
import { Message } from "discord.js"
import { generateErrorMessage, getFiles } from "@template/functions"
import { logger } from "@template/logger"
import path from "path"

export default class TextCommandHandler {
	public client: BetterClient

	constructor(client: BetterClient) {
		this.client = client
	}

	public async loadFiles() {
		try {
			const textCommandsPath = path.join(this.client.__dirname, "src", "bot", "textCommands")
			const parentFolders = getFiles(textCommandsPath, "", true)

			for (const parentFolder of parentFolders) {
				const files = getFiles(path.join(textCommandsPath, parentFolder), "js")

				for (const fileName of files) {
					const filePath = path.join(textCommandsPath, parentFolder, fileName)
					const fileUrl = `file://${filePath.replace(/\\/g, "/")}`
					const textCommands = await import(fileUrl)
					const textCommand = new textCommands.default(this.client)
					this.client.textCommands.set(textCommand.key, textCommand)
				}
			}
		} catch (e) {
			console.log(e)
			logger.warn("Failed to load files for textCommands handler")
		}
	}

	public reloadFiles() {
		this.client.textCommands.clear()
		this.loadFiles()
	}

	public fetchCommand(key: string) {
		return this.client.textCommands.get(key) || undefined
	}

	public async handle(message: Message) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const prefix = `<@${this.client.user!.id}> `
		if (!prefix || !message.content.startsWith(prefix)) return
		const args = message.content.slice(prefix.length).trim().split(/ +/g)
		const commandName = args.shift()?.toLowerCase()
		const command = this.fetchCommand(commandName || "")
		if (!command) return

		const missingPermissions = await command.validate(message)
		if (missingPermissions) return message.reply(generateErrorMessage(missingPermissions))

		return this.runCommand(command, message, args)
	}

	private async runCommand(command: TextCommand, message: Message, args: string[]) {
		this.client.usersUsingBot.add(message.author.id)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await command.run(message, args).catch(async (error: any): Promise<any> => {
			logger.thrownError(error, { guildId: message.guildId, userId: message.author.id, command: command.key })
			return message.reply(
				generateErrorMessage({
					title: "An Error Has Occurred",
					description: `An unexpected error was encountered while running \`${command.key}\`, my developers have already been notified! Feel free to join my support server in the mean time!`,
				})
			)
		})
		this.client.usersUsingBot.delete(message.author.id)
	}
}
