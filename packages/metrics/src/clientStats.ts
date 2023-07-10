import { Client } from "discord.js"
import { Gauge } from "prom-client"

import { updateGuildMemberCounts } from "../index.js"

const templateGuildsTotal = new Gauge({
	name: "template_guilds_total",
	help: "Total guilds"
})

const templateClientPing = new Gauge({
	name: "template_client_ping",
	help: "Client ping"
})

export const updateClientStats = (client: Client) => {
	templateGuildsTotal.set(client.guilds.cache.size)
	client.guilds.cache.map((x) => {
		updateGuildMemberCounts(x)
	})
}

export const updatePing = (client: Client) => {
	templateClientPing.set(client.ws.ping)
}