import { PrismaClient } from "@prisma/client"
import Database from "./src/db"

const prismaDb = new PrismaClient()

export default prismaDb

export * from "@prisma/client"

export const database = new Database(prismaDb)

export enum ApiPermission {
	Levels = 1 << 0,
	Multipliers = 1 << 1,
	Export = 1 << 2,
	Blacklist = 1 << 3,
}
