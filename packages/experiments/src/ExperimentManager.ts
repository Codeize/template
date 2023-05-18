import murmurhash from "murmurhash"
import { rawExperiments, experimentData } from "../index.js"
import db from "@template/database"

export class Experiment {
	rawData: experimentData

	id: number
	name: string
	featureKey: string
	rolloutPercent: number
	settings: {
		forceEnabled: string[]
		forceDisabled: string[]
		forceEnabledTags: string[]
		forceDisabledTags: string[]
	}

	constructor(rawData: experimentData) {
		this.rawData = rawData
		this.name = rawData.name
		this.featureKey = rawData.feature_key

		this.settings = {
			forceEnabled: this.rawData.force_enabled || [],
			forceDisabled: this.rawData.force_disabled || [],
			forceEnabledTags: this.rawData.force_enabled_tags || [],
			forceDisabledTags: this.rawData.force_disabled_tags || [],
		}

		this.rolloutPercent = rawData.rollout_percentage > 100 ? 100 : rawData.rollout_percentage

		this.id = murmurhash.v3(this.featureKey)
	}

	async checkAccess(guildId: string, tags: string[]) {
		if (this.settings.forceDisabled.includes(guildId)) return false
		if (this.settings.forceEnabled.includes(guildId)) return true

		if (tags.some((x) => this.settings.forceEnabledTags.includes(x))) return true
		if (tags.some((x) => this.settings.forceDisabledTags.includes(x))) return false

		if (this.rolloutPercent === 100) return true

		const hash = murmurhash.v3(`${this.featureKey}:${guildId}`) % 100

		return hash < this.rolloutPercent
	}
}

export default class ExperimentManager {
	experiments: Experiment[]
	constructor() {
		this.experiments = []

		this.loadExperiments()
	}

	async checkExperimentAccess(featureKey: string, guildId: string) {
		const experiment = this.getExperimentByKey(featureKey)
		if (!experiment) return false // if that isn't an experiment, deny the feature to be safe
		//const tags =
		await db.guild.upsert({
			where: {
				id: guildId,
			},
			create: {
				id: guildId,
			},
			update: {},
		})
		return experiment.checkAccess(guildId, [])
	}

	getExperimentByHash(id: string) {
		return this.experiments.find((e) => e.featureKey === id)
	}

	getExperimentByKey(key: string) {
		return this.experiments.find((e) => e.featureKey === key)
	}

	private loadExperiments() {
		for (const experimental of rawExperiments) {
			this.experiments.push(new Experiment(experimental))
		}
	}
}
