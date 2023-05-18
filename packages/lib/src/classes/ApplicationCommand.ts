import {
	ApplicationCommandOptionData,
	ApplicationCommandType,
	AutocompleteFocusedOption,
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	MessageContextMenuCommandInteraction,
	UserContextMenuCommandInteraction,
} from "discord.js"
import { BetterClient, ApplicationCommandOptions } from "../../index.js"
import BaseComponent from "./_BaseComponent.js"

export default class ApplicationCommand extends BaseComponent {
	public readonly description: string
	public readonly type: ApplicationCommandType = ApplicationCommandType.ChatInput
	public readonly options: ApplicationCommandOptionData[] = []

	constructor(key: string, client: BetterClient, options: ApplicationCommandOptions) {
		super(key, client, options)
		this.description = options.description
		this.options = options.options || []
		this.type = options.type || ApplicationCommandType.ChatInput
	}

	public override async run(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		_interaction: MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction | ChatInputCommandInteraction
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-empty-function
	): Promise<any> {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-empty-function, @typescript-eslint/no-unused-vars
	public async autocomplete(_interaction: AutocompleteInteraction, _option: AutocompleteFocusedOption): Promise<void> {}
}
