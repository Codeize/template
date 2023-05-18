/**
 * Generate a unix timestamp for Discord to be rendered locally per user.
 * @param options - The options to use for the timestamp.
 * @returns The generated timestamp.
 */
export const generateTimestamp = (options?: GenerateTimestampOptions): string => {
	let timestamp = options?.timestamp || new Date()
	const type = options?.type || "f"
	if (timestamp instanceof Date) timestamp = timestamp.getTime()
	return `<t:${Math.floor(timestamp / 1000)}:${type}>`
}

export interface GenerateTimestampOptions {
	timestamp?: Date | number
	type?: "t" | "T" | "d" | "D" | "f" | "F" | "R"
}
