import { KeyTranslations, Locales, TranslationInfo } from "../index.js"
import { getLangNameFromCode } from "language-name-map"
import { DebugType, logger } from "@template/logger"
import { getFiles } from "@template/functions"
import { Collection } from "discord.js"

import path from "path"
import { fileURLToPath } from "url"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default class LocaleManager {
	public locales: Locales

	constructor() {
		this.locales = {}

		this.loadLocales()
	}

	/**
	 * Get a string from translated locale data
	 * @param type - The type of component this is for
	 * @param key - The key of the string
	 * @param replacers - The replacers to use
	 * @param localeRaw - The locale to get (defaults to "en")
	 */
	public getString(type: string, key: string, replacers: { [replaceKey: string]: string | number } = {}, localeRaw = "en"): string {
		const locale = this.convertDiscordLocale(localeRaw)
		if (!this.locales[type]) {
			logger.error(`Component ${type} does not exist`)
			return `String ${key} not found`
		}
		if (!this.locales[type][locale] || !this.locales[type][locale].has(key)) {
			logger.error(`String key ${key} does not exist for locale ${locale} on component ${type}`)
			return `${this.locales[type].en.get(key)}` || `String ${key} not found`
		}
		let string = `${this.locales[type][locale].get(key)}` || `String not found for component ${type} and key ${key}`
		for (const [k, v] of Object.entries(replacers)) {
			string = string.replace(`{${k}}`, `${v}`)
		}
		return string
	}

	public convertDiscordLocale(locale: string, toDiscordVersion = false): string {
		const replacers: { [key: string]: string } = { en: "en-US", es: "es-ES", pt: "pt-BR" }
		if (toDiscordVersion) {
			return replacers[locale] || locale
		}
		return Object.keys(replacers).find((x) => replacers[x] === locale) || locale
	}

	/**
	 * Get all translations of a given key
	 * @param type - The type of component this is for
	 * @param key - The key of the string
	 * @returns An object of key translations
	 */
	public getAllTranslations(type: string, key: string): KeyTranslations {
		const translations: KeyTranslations = {}
		const component = this.locales[type]
		if (!component) {
			return {}
		}
		for (const [locale, localeData] of Object.entries(component)) {
			if (localeData.has(key)) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				translations[locale] = localeData.get(key)!
			}
		}
		return translations
	}

	public getTranslationInfo(key: string): TranslationInfo {
		for (const [type, component] of Object.entries(this.locales)) {
			for (const [locale, localeData] of Object.entries(component)) {
				if (localeData.has(key)) {
					return {
						key,
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						translation: localeData.get(key)!,
						locale,
						component: type,
					}
				}
			}
		}
		return {
			key,
			translation: "",
			locale: "en",
			component: "",
		}
	}

	public getSupportedLocales(): string[] {
		const result: string[] = []
		for (const [, component] of Object.entries(this.locales)) {
			for (const [locale] of Object.entries(component)) {
				if (!result.includes(locale)) result.push(locale)
			}
		}
		return result.map((x) => getLangNameFromCode(x)?.name || x)
	}

	private loadLocales() {
		getFiles(`${__dirname}/../translations`, "", true).forEach((parentFolder) => {
			this.locales[parentFolder] = {}
			getFiles(`${__dirname}/../translations/${parentFolder}`, "json").forEach(async (fileName) => {
				logger.debug(`Loading locale ${fileName} for component ${parentFolder}`, DebugType.I18N)
				const localeData = await import(`${__dirname}/../translations/${parentFolder}/${fileName}`)
				const localeCollection = new Collection<string, string>()
				for (const [key, value] of Object.entries(localeData)) {
					localeCollection.set(key, `${value}`)
				}
				const localeName = fileName.replace("json", "")
				this.locales[parentFolder][localeName] = localeCollection
			})
		})
	}
}
