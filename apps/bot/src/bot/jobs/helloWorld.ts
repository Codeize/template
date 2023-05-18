import { logger } from "@template/logger"
import Cron from "croner"

const helloWorld = async () => {
	logger.info("Hello from the cron job!")
}

const startCron = () => {
	Cron("* * * * *", async () => {
		// Every minute
		await helloWorld().catch((error) => {
			logger.thrownError(error)
		})
	})
}

export { startCron }
