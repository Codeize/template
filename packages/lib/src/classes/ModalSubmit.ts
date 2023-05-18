import { ModalSubmitInteraction } from "discord.js"
import { BetterClient } from "../../index.js"

export default class ModalSubmit {
	/**
	 * The beginning of the customId this modal listens for.
	 */
	public readonly name: string

	/**
	 * Our client.
	 */
	public readonly client: BetterClient

	/**
	 * Create our modal.
	 * @param name - The beginning of the customId this modal submit listens for.
	 * @param client - Our client.
	 * @param options - The options for our modal.
	 */
	constructor(name: string, client: BetterClient) {
		this.name = name
		this.client = client
	}

	/**
	 * Run this modal.
	 * @param _interaction - The interaction that was created.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-empty-function, @typescript-eslint/no-unused-vars
	public async run(_interaction: ModalSubmitInteraction): Promise<any> {}
}
