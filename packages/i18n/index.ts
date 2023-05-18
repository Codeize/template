import { Collection } from "discord.js"

export { default as LocaleManager } from "./src/LocaleManager.js"
export interface Locales {
	[key: string]: {
		[key: string]: Collection<string, string>
	}
}

export interface KeyTranslations {
	[key: string]: string
}

export interface TranslationInfo {
	key: string
	translation: string
	locale: string
	component: string
}
