import { BetterClient, _BaseHandler, HandlerType } from "../../index.js"
export default class ButtonHandler extends _BaseHandler {
	constructor(client: BetterClient) {
		super(HandlerType.Button, client)
	}
}
