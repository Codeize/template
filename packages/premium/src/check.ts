import { getGuildData, getUserData } from "@template/database"

export const checkUserPremium = async (userId: string) => {
	const user = await getUserData(userId)
	return user.premium
}

export const checkGuildPremium = async (guildId: string) => {
	const guild = await getGuildData(guildId, { premiumGuildSlots: true })
	return guild.premiumGuildSlots?.some((slot) => slot.expiresAt > new Date()) || false
}
