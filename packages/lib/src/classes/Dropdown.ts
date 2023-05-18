import { BetterClient, _BaseComponent, DropdownOptions } from "../../index.js"
import { AnySelectMenuInteraction, APIEmbed } from "discord.js"

export default class Dropdown extends _BaseComponent {
	constructor(key: string, client: BetterClient, options?: DropdownOptions) {
		super(key, client, options || {})
	}

	public override async specificValidate(_interaction: AnySelectMenuInteraction): Promise<APIEmbed | null> {
		if (this.authorOnly && _interaction.user.id !== _interaction.message.interaction?.user.id) {
			return {
				title: "Missing Permissions",
				description: "This dropdown is not for you!",
			}
		}
		return null
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-empty-function, @typescript-eslint/no-unused-vars
	public override async run(_interaction: AnySelectMenuInteraction): Promise<any> {}
}
