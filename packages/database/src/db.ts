import { FactoryReset, Guild, PremiumGuildSlot, User, PrismaClient, Prisma, UserGuildData } from "../../../node_modules/.prisma/client"

export default class Database {
	constructor(public db: PrismaClient) {}

	public async deleteAllUserGuildData(guildId: string): Promise<void> {
		await this.db.userGuildData.deleteMany({
			where: {
				guildId,
			},
		})
	}

	public async deleteAllGuildSettings(guildId: string): Promise<void> {
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

	public async markFactoryReset(guildId: string, executorId: string): Promise<FactoryReset> {
		const reset = await this.db.factoryReset.create({
			data: {
				guildId,
				executorId,
				resetAt: new Date(),
			},
		})
		return reset
	}

	public async getFactoryResets(guildId: string): Promise<FactoryReset[]> {
		return await this.db.factoryReset.findMany({
			where: {
				guildId,
			},
		})
	}

	public async getGuildData(
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

	public async getUserData(
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

	public async getUserGuildData(userId: string, guildId: string): Promise<UserGuildData> {
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
}
