import { PrismaClient } from "../../../node_modules/.prisma/client"

import { getFactoryResets, markFactoryReset } from "./modules/FactoryReset"
import { deleteAllGuildSettings, getGuildData } from "./modules/Guild"
import { deleteAllUserGuildData, getUserGuildData } from "./modules/Member"
import { getUserData } from "./modules/User"

export default class Database {
	constructor(public db: PrismaClient) {}

	// MEMBER
	public getUserGuildData = getUserGuildData
	public deleteAllUserGuildData = deleteAllUserGuildData

	// GUILD
	public getGuildData = getGuildData
	public deleteAllGuildSettings = deleteAllGuildSettings

	// USER
	public getUserData = getUserData

	// FACTORY RESET
	public getFactoryResets = getFactoryResets
	public markFactoryReset = markFactoryReset
}
