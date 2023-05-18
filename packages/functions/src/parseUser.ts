import { Client, User } from "discord.js"

export const parseUser = async (userInput: string, client: Client): Promise<User | null> => {
	let user = userInput
	if ((user.startsWith("<@") || user.startsWith("<@!")) && user.endsWith(">")) user = user.slice(2, -1)
	if (user.startsWith("!")) user = user.slice(1)
	try {
		return (
			client.users.cache.get(user) ||
			client.users.cache.find((u) => u.tag.toLowerCase() === user?.toLowerCase()) ||
			(await client.users.fetch(user))
		)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		if (error.code === 50035) return null
		throw new Error(error)
	}
	return null
}
