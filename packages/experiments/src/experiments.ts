export interface experimentData {
	name: string
	feature_key: string
	rollout_percentage: number
	force_enabled?: string[]
	force_disabled?: string[]
	force_enabled_tags?: string[]
	force_disabled_tags?: string[]
}

export const rawExperiments: experimentData[] = []
