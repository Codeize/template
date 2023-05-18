import { logger } from "@template/logger"
import { AutocompleteInteraction } from "discord.js"
import { BetterClient, ApplicationCommand } from "../../index.js"

export default class AutoCompleteHandler {
	/**
	 * Our client.
	 */
	private readonly client: BetterClient

	/**
	 * Create our AutoCompleteHandler.
	 * @param client - Our client.
	 */
	constructor(client: BetterClient) {
		this.client = client
	}

	/**
	 * Fetch the autoComplete with the provided name.
	 * @param name - The name to search for.
	 * @returns The autoComplete we've found.
	 */
	private fetchAutoComplete(name: string): ApplicationCommand | undefined {
		return this.client.applicationCommands.find((autoComplete) => autoComplete.key === name)
	}

	/**
	 * Handle the interaction created for this autoComplete to make sure the user and client can execute it.
	 * @param interaction - The interaction created.
	 */
	public async handleAutoComplete(interaction: AutocompleteInteraction) {
		const autoComplete = this.fetchAutoComplete(interaction.commandName)
		if (!autoComplete) return

		return this.runAutoComplete(autoComplete, interaction)
	}

	/**
	 * Execute our autoComplete.
	 * @param autoComplete - The autoComplete we want to execute.
	 * @param interaction - The interaction for our autoComplete.
	 */
	private async runAutoComplete(autoComplete: ApplicationCommand, interaction: AutocompleteInteraction) {
		const focused = interaction.options.getFocused(true)

		autoComplete
			.autocomplete(interaction, focused)

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.catch(async (error): Promise<any> => {
				logger.thrownError(error)
				if (!interaction.responded) return interaction.respond([])
			})
	}
}
