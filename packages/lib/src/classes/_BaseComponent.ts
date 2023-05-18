import { BetterClient, BaseComponentOptions } from "../../index.js"
import { APIEmbed, BaseInteraction, PermissionsBitField } from "discord.js"
import { logger } from "@template/logger"
import { getPermissionName, isAdmin } from "@template/functions"
import { checkGuildPremium, checkUserPremium } from "@template/premium"

export default class BaseComponent {
	public readonly client: BetterClient
	public readonly key: string
	public readonly dotPerm?: string
	public readonly permissions?: PermissionsBitField
	private readonly clientPermissions?: PermissionsBitField
	private readonly adminOnly: boolean
	private readonly guildOnly: boolean
	private readonly ownerOnly: boolean
	public readonly cooldown: number
	public readonly featureKey?: string
	public readonly userPremium: boolean
	public readonly guildPremium: boolean
	public readonly authorOnly: boolean

	constructor(key: string, client: BetterClient, options: BaseComponentOptions) {
		this.key = key
		this.client = client
		if (this.dotPerm) this.dotPerm = options.dotPerm
		if (this.permissions) this.permissions = new PermissionsBitField(options.permissions)
		if (this.clientPermissions) this.clientPermissions = new PermissionsBitField(options.clientPermissions)
		this.adminOnly = options.adminOnly || false
		this.guildOnly = options.guildOnly || false
		this.ownerOnly = options.ownerOnly || false
		this.cooldown = options.cooldown || 0
		if (this.featureKey) this.featureKey = options.featureKey
		this.userPremium = options.userPremium || false
		this.guildPremium = options.guildPremium || false
		this.authorOnly = options.authorOnly || false
	}

	public t(key: string, replacers: { [replaceKey: string]: string | number } = {}): string {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return this.client.localeManager.getString(this.key, key, replacers, this.client.localeCache.get(this.client.user!.id) || "en")
	}

	public async validate(interaction: BaseInteraction): Promise<APIEmbed | null> {
		if (this.guildOnly && !interaction.guild) {
			return {
				title: "Missing Permissions",
				description: "This action can only be used in guilds!",
			}
		}

		if (this.userPremium && !(await checkUserPremium(interaction.user.id))) {
			return {
				title: "Missing Access",
				description: "This action is only available to premium users.",
			}
		}

		if (interaction.guild) {
			if (this.featureKey && !this.client.experimentManager.checkExperimentAccess(this.featureKey, interaction.guild.id)) {
				return {
					title: "Missing Access",
					description: "This action is not accessible.",
				}
			}
			if (this.guildPremium && !(await checkGuildPremium(interaction.guild.id))) {
				return {
					title: "Missing Access",
					description: "This action is only available to premium guilds.",
				}
			}
			if (this.ownerOnly && interaction.guild?.ownerId !== interaction.user.id) {
				return {
					title: "Missing Permissions",
					description: "This action can only be ran by the owner of this guild!",
				}
			}
			if (interaction.guild && this.permissions && interaction.memberPermissions?.has(this.permissions)) {
				return {
					title: "Missing Permissions",
					description: `You need the ${this.permissions
						.toArray()
						.map((permission) => `**${getPermissionName(permission)}**`)
						.join(", ")} permission${this.permissions.toArray().length > 1 ? "s" : ""} to run this action.`,
				}
			}
			if (interaction.guild && this.clientPermissions && !interaction.guild?.members.me?.permissions.has(this.clientPermissions)) {
				return {
					title: "Missing Permissions",
					description: `I need the ${this.clientPermissions
						.toArray()
						.map((permission) => `**${getPermissionName(permission)}**`)
						.join(", ")} permission${this.clientPermissions.toArray().length > 1 ? "s" : ""} to run this action.`,
				}
			}
		}

		if (this.adminOnly && !isAdmin(interaction.user.id)) {
			return {
				title: "Missing Permissions",
				description: `This action can only be used by ${this.client.user?.username || "the bot"} Admins!`,
			}
		}

		const specifics = await this.specificValidate(interaction)
		if (specifics) return specifics
		return null
	}

	public async specificValidate(_interaction: BaseInteraction): Promise<APIEmbed | null> {
		return null
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-empty-function
	public async run(interaction: BaseInteraction): Promise<any> {
		logger.null(interaction)
		throw new Error("Not implemented")
	}
}
