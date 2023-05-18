import database from "@template/database"

export const checkDBStatus = async () => {
	try {
		await database.$queryRaw`SELECT 1`
		return true
	} catch {
		// There was an error connecting to the database. That's all we're checking for, we should just return false.
		return false
	}
}
