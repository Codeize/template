import {
	ValidatorRule,
	ValidatorOptions,
	ValidatorRuleUnion,
	StringValidatorRule,
	NumberValidatorRule,
	ArrayValidatorRule,
	ObjectValidatorRule
} from "./types"
import { Result, IResult } from "@sapphire/result"

export class Validator {
	private rules: ValidatorRuleUnion[]
	private options: ValidatorOptions

	constructor(rules: ValidatorRuleUnion[], options?: ValidatorOptions) {
		this.rules = rules
		this.options = options ?? { throwOnUnknownField: false }
	}

	validate(data: string | number | boolean | Array<unknown> | object): IResult<unknown, string> {
		for (const rule of this.rules) {
			const { name, type } = rule
			switch (typeof data) {
				case "string": {
					if (type !== "string") {
						return Result.err(`Expected '${name}' to be a string but got '${typeof data}'.`)
					}
					const { minLength, maxLength, enumValues, isBoolean, isNumber } = rule as StringValidatorRule
					if (minLength !== undefined && data.length < minLength) {
						return Result.err(`Expected '${name}' to be at least ${minLength} characters long but got length ${data.length}.`)
					}
					if (maxLength !== undefined && data.length > maxLength) {
						return Result.err(`Expected '${name}' to be at most ${maxLength} characters long but got length ${data.length}.`)
					}
					if (enumValues !== undefined && !enumValues.includes(data)) {
						return Result.err(`Expected '${name}' to be one of the following values: ${enumValues.join(", ")}\n\nBut got '${data}'.`)
					}
					if (isNumber && Number.isNaN(Number(data))) {
						Result.err(`Expected '${name}' to be a number but got '${data}'.`)
					}
					if (isBoolean && !["true", "false"].includes(data)) {
						return Result.err(`Expected '${name}' to be a boolean (true or false) but got '${data}'.`)
					}
					return this.defaultValidate(data, rule)
				}
				case "number": {
					const { integer, min, max, enumValues } = rule as NumberValidatorRule
					if (integer && !Number.isInteger(data)) {
						return Result.err(`Expected '${name}' to be an integer (1, 2, 3, ...) but got ${data}.`)
					}
					if (min && data < min) {
						return Result.err(`Expected '${name}' to be at least ${min} but got ${data}.`)
					}
					if (max && data > max) {
						return Result.err(`Expected '${name}' to be at most ${max} but got ${data}.`)
					}
					if (enumValues && !enumValues.includes(data)) {
						return Result.err(`Expected '${name}' to be one of the following values: ${enumValues.join(", ")}\n\nBut got '${data}'.`)
					}
					return this.defaultValidate(data, rule)
				}
				case "boolean": {
					if (typeof data !== "boolean") {
						return Result.err(`Expected '${name}' to be a boolean (true or false) but got '${typeof data}'.`)
					}
					return this.defaultValidate(data, rule)
				}
				case "object": {
					switch (Array.isArray(data)) {
						case true: {
							const { minLength, maxLength, expectedTypes } = rule as ArrayValidatorRule
							if (!Array.isArray(data)) {
								return Result.err(`Expected '${name}' to be an array but got '${typeof data}'.`)
							}
							if (minLength && data.length < minLength) {
								return Result.err(`Expected '${name}' to be at least ${minLength} items long but got ${data.length}.`)
							}
							if (maxLength && data.length > maxLength) {
								return Result.err(`Expected '${name}' to be at most ${maxLength} items long but got ${data.length}.`)
							}
							if (expectedTypes) {
								for (const item of data) {
									if (!expectedTypes.includes(typeof item)) {
										return Result.err(
											`'${name}' contains an item, '${item}', that is not one of the allowed types this array can have: ${expectedTypes.join(
												", "
											)}`
										)
									}
								}
							}

							return this.defaultValidate(data, rule)
						}
						case false: {
							const { rules } = rule as ObjectValidatorRule
							if (typeof data !== "object") {
								return Result.err(`Expected '${name}' to be an object but got '${typeof data}'.`)
							}
							if (rules) {
								const scannedRules: string[] = []
								// For each "key": "value" pair in the object
								for (const [key, value] of Object.entries(data)) {
									// Find the rule that matches the key
									const rule = rules.find((rule) => rule.name === key)
									if (rule) {
										scannedRules.push(rule.name)
										// Validate the value with the rule
										const validator = new Validator([rule], this.options)
										const result = validator.validate(value)
										if (result.isErr()) {
											return result
										}
									}
								}
								// Check if any rules were not scanned
								const missingRules = rules.filter((rule) => !scannedRules.includes(rule.name))
								if (missingRules.length > 0) {
									return Result.err(
										`The following fields were expected but not found: ${missingRules.map((rule) => rule.name).join(", ")}`
									)
								}
							}
							// Check if any unknown fields were found
							if (this.options.throwOnUnknownField && rules) {
								const keys = Object.keys(data)
								for (const key of keys) {
									if (!rules.some((rule) => rule.name === key)) {
										return Result.err(`The field '${key}' is unknown, was not expected, and is therefore not allowed.`)
									}
								}
							}
							return this.defaultValidate(data, rule)
						}
						default: {
							return Result.err(
								`Expected '${name}' to be a valid type (string, number, boolean, array, or object) but got '${typeof data}'.`
							)
						}
					}
				}
				default: {
					return Result.err(`Expected '${name}' to be a valid type (string, number, boolean, array, or object) but got '${typeof data}'.`)
				}
			}
		}
		return Result.ok()
	}

	defaultValidate(data: string | number | boolean | Array<unknown> | object, rule: ValidatorRule): IResult<unknown, string> {
		const { name, required, nullishOptions, customValidator } = rule

		if (required && data === undefined) {
			return Result.err(`Expected '${name}' to be defined but it was undefined.`)
		}
		if (nullishOptions) {
			const { allowUndefined, allowNull } = nullishOptions
			if (data === undefined && !allowUndefined) {
				return Result.err(`The field ${name} cannot be undefined because allowUndefined is set to false.`)
			}
			if (data === null && !allowNull) {
				return Result.err(`The field ${name} cannot be null because allowNull is set to false.`)
			}
		}
		if (data === undefined && required) {
			return Result.err(`Expected '${name}' to be defined because it is required.`)
		}
		if (customValidator) {
			const customErrors = customValidator(data)
			if (customErrors) {
				return Result.err(`[CV] Expected '${name}' to be valid but got the following errors: ${customErrors.message}`)
			}
		}

		return Result.ok()
	}
}
