import { PrismaClient } from "@prisma/client"

const database = new PrismaClient()

export default database

export * from "@prisma/client"

export * from "./src/getData.js"
export * from "./src/factoryReset.js"

export enum ApiPermission {
	Levels = 1 << 0,
	Multipliers = 1 << 1,
	Export = 1 << 2,
	Blacklist = 1 << 3,
}
