import Database from "../db"
import { UserGuildData } from "../../../../node_modules/.prisma/client"

export async function deleteAllUserGuildData(this: Database, guildId: string): Promise<void> {
	await this.db.userGuildData.deleteMany({
		where: {
			guildId,
		},
	})
}

export async function getUserGuildData(this: Database, userId: string, guildId: string): Promise<UserGuildData> {
	const userGuildData = await this.db.userGuildData.upsert({
		where: {
			userId_guildId: {
				userId,
				guildId,
			},
		},
		update: {},
		create: {
			userId,
			guildId,
		},
	})
	return userGuildData
}
