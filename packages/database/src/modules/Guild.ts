import Database from "../db"
import { Prisma, UserGuildData, FactoryReset, PremiumGuildSlot, Guild } from "../../../../node_modules/.prisma/client"

export async function getGuildData(
	this: Database,
	guildId: string,
	include: Prisma.GuildInclude = { premiumGuildSlots: true }
): Promise<
	Guild & {
		userData?: UserGuildData[] | undefined
		premiumGuildSlots?: PremiumGuildSlot[] | undefined
		factoryResets?: FactoryReset[] | undefined
		_count?: Prisma.GuildCountOutputType | undefined
	}
> {
	if (!guildId) throw new Error("No guild ID provided")
	const guildData = await this.db.guild.upsert({
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

export async function deleteAllGuildSettings(this: Database, guildId: string): Promise<void> {
	await this.db.guild.delete({
		where: {
			id: guildId,
		},
	})

	await this.db.guild.create({
		data: {
			id: guildId,
		},
	})
}
