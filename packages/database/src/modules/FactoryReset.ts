import { FactoryReset } from "../../../../node_modules/.prisma/client"
import Database from "../db"

export async function markFactoryReset(this: Database, guildId: string, executorId: string): Promise<FactoryReset> {
	const reset = await this.db.factoryReset.create({
		data: {
			guildId,
			executorId,
			resetAt: new Date(),
		},
	})
	return reset
}

export async function getFactoryResets(this: Database, guildId: string): Promise<FactoryReset[]> {
	return await this.db.factoryReset.findMany({
		where: {
			guildId,
		},
	})
}
