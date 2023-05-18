/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger as WinstonLogger, createLogger, transports, format } from "winston"
import { DebugType } from "./index.js"

export default class Logger {
	private winston: WinstonLogger

	constructor() {
		this.winston = createLogger({
			transports: [
				new transports.Console({
					format: format.combine(format.colorize(), format.simple(), format.errors({ stack: true })),
					handleExceptions: true,
					handleRejections: true,
					level: "silly",
				}),
			],
		})
	}

	public log(message: string, properties?: { [key: string]: any }): void {
		this.winston.log(message, properties)
	}

	public debug(message: any, type: DebugType = DebugType.GENERAL, properties?: { [key: string]: any }): void {
		if (typeof message === "object") message = JSON.stringify(message, null, 2)
		this.winston.debug(message, { type, ...properties })
	}

	public warn(message: string, properties: { [key: string]: any } = {}): void {
		this.winston.warn(message, properties)
	}

	public info(message: string, properties?: { [key: string]: any }): void {
		this.winston.info(message, properties)
	}

	public error(message: string, properties: { [key: string]: any } = {}): void {
		this.winston.error(message)
		this.null(properties)
	}

	public thrownError(error: Error, properties: { [key: string]: any } = {}): void {
		console.error(error)
		this.winston.error(`${error.message} ${error.stack}`)
		this.null(properties)
	}

	public null(..._args: unknown[]): null {
		return null
	}
}
