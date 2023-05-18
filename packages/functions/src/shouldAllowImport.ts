import { FactoryReset } from "@template/database"

export const shouldAllowImport = (threshold: number, factoryResets: FactoryReset[]) => {
	if (factoryResets.length === 0) return false
	const newestReset = factoryResets[factoryResets.length - 1]
	const now = new Date()
	const timeSinceReset = now.getTime() - newestReset.resetAt.getTime()
	return timeSinceReset > threshold
}
