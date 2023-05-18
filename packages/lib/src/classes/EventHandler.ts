import { logger } from "@template/logger"
import { ClientEvents } from "discord.js"
import { BetterClient } from "../../index.js"

export default class EventHandler {
	/**
	 * The name of our event.
	 */
	public readonly name: keyof ClientEvents

	/**
	 * Our client.
	 */
	public readonly client: BetterClient

	/**
	 * The listener for our event.
	 */
	private readonly _listener

	/**
	 * Create our event.
	 * @param client - Our client.
	 * @param name - The name of our client.
	 */
	constructor(client: BetterClient, name: keyof ClientEvents) {
		this.name = name
		this.client = client
		this._listener = this._run.bind(this)
	}

	/**
	 * Execute our event.
	 * @param args - The arguments for our event.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private async _run(...args: any) {
		try {
			return await this.run(...args)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			logger.thrownError(error)
		}
	}

	/**
	 * Execute our event.
	 * @param _args - The arguments for our event.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-empty-function, @typescript-eslint/no-unused-vars
	public async run(..._args: any): Promise<any> {}

	/**
	 * Listen for our event.
	 */
	public listen() {
		return this.client.on(this.name, this._listener)
	}

	/**
	 * Stop listening for our event.
	 */
	public removeListener() {
		return this.client.off(this.name, this._listener)
	}
}
