import db, { FactoryReset } from "../index.js"

export const deleteAllUserGuildData = async (guildId: string): Promise<void> => {
	await db.userGuildData.deleteMany({
		where: {
			guildId,
		},
	})
}

export const deleteAllGuildSettings = async (guildId: string): Promise<void> => {
	await db.guild.delete({
		where: {
			id: guildId,
		},
	})

	await db.guild.create({
		data: {
			id: guildId,
		},
	})
}

export const markFactoryReset = async (guildId: string, executorId: string): Promise<FactoryReset> => {
	const reset = await db.factoryReset.create({
		data: {
			guildId,
			executorId,
			resetAt: new Date(),
		},
	})
	return reset
}

export const getFactoryResets = async (guildId: string): Promise<FactoryReset[]> => {
	const resets = await db.factoryReset.findMany({
		where: {
			guildId,
		},
	})
	return resets
}
