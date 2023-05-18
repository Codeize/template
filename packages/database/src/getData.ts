import db, { Prisma, UserGuildData } from "../index.js"

export const getGuildData = async (guildId: string, include: Prisma.GuildInclude = { premiumGuildSlots: true }) => {
	if (!guildId) throw new Error("No guild ID provided")
	const guildData = await db.guild.upsert({
		where: {
			id: guildId,
		},
		update: {},
		create: {
			id: guildId,
		},
		include,
	})
	return guildData
}

export const getUserData = async (userId: string, include: Prisma.UserInclude = { premiumGuildSlots: true }) => {
	const userData = await db.user.upsert({
		where: {
			id: userId,
		},
		update: {},
		create: {
			id: userId,
		},
		include,
	})
	return userData
}

export const getUserGuildData = async (userId: string, guildId: string): Promise<UserGuildData> => {
	const userGuildData = await db.userGuildData.upsert({
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
