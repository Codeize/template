import database, { Guild, PremiumGuildSlot } from "@template/database"
import { generateTimestamp } from "@template/functions"

export const activateSlot = async (slotId: string, guildId: string): Promise<PremiumGuildSlot | null> => {
	const slot = await database.premiumGuildSlot.findUnique({
		where: {
			id: slotId,
		},
	})
	if (!slot) return null
	if (slot.guildId) return null
	const done = await database.premiumGuildSlot.update({
		where: {
			id: slotId,
		},
		data: {
			guildId: guildId,
		},
	})
	return done
}

export const deactivateSlot = async (slotId: string): Promise<PremiumGuildSlot | null> => {
	const slot = await database.premiumGuildSlot.findUnique({
		where: {
			id: slotId,
		},
	})
	if (!slot) return null
	const done = await database.premiumGuildSlot.update({
		where: {
			id: slotId,
		},
		data: {
			guild: {
				disconnect: true,
			},
		},
	})
	return done
}

export const getMemberSlots = async (userId: string): Promise<(PremiumGuildSlot & { guild: Guild | null })[]> => {
	const slots = await database.premiumGuildSlot.findMany({
		where: {
			userId,
		},
		include: {
			guild: true,
		},
	})
	return slots ?? []
}

export const slotInfoFormat = async (slot: PremiumGuildSlot & { guild: Guild | null }): Promise<string> => {
	return `${
		slot.guildId ? `[${slot.guild?.name || slot.guildId}](https://discord.com/channels/${slot.guildId})` : "Unused Slot"
	} - Expires: ${generateTimestamp({ timestamp: slot.expiresAt, type: "R" })}`
}
