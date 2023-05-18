import { APIEmbed, ButtonInteraction } from "discord.js"
import { BetterClient, _BaseComponent, ButtonOptions } from "../../index.js"

export default class Button extends _BaseComponent {
	constructor(key: string, client: BetterClient, options?: ButtonOptions) {
		super(key, client, options || {})
	}

	public override async specificValidate(_interaction: ButtonInteraction): Promise<APIEmbed | null> {
		if (this.authorOnly && _interaction.user.id !== _interaction.message.interaction?.user.id) {
			return {
				title: "Missing Permissions",
				description: "This button is not for you!",
			}
		}
		return null
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-empty-function, @typescript-eslint/no-unused-vars
	public override async run(_interaction: ButtonInteraction): Promise<any> {}
}
