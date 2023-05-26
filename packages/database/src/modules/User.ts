import { UserGuildData, PremiumGuildSlot, Prisma, User } from "../../../../node_modules/.prisma/client"
import Database from "../db"

export async function getUserData(
	this: Database,
	userId: string,
	include: Prisma.UserInclude = { premiumGuildSlots: true }
): Promise<
	User & {
		premiumGuildSlots?: PremiumGuildSlot[] | undefined
		guildData?: UserGuildData[] | undefined
		_count?: Prisma.UserCountOutputType | undefined
	}
> {
	const userData = await this.db.user.upsert({
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
