/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ValidatorOptions {
	throwOnUnknownField: boolean
}

export interface ValidatorRule {
	/**
	 * In an ObjectValidator the expected name of this field. Otherwise, the name to use in an error message
	 */
	name: string
	/**
	 * The type of this field
	 */
	type: ValidatorRuleType
	/**
	 * Whether this field is required
	 */
	required?: boolean
	/**
	 * The nullish values options
	 */
	nullishOptions?: ValidatorNullishOptions
	/**
	 * The custom validator function
	 * @param value The value to validate
	 * @returns Whether the value is valid or not and a message if it's not. { valid: boolean, message?: string }
	 */
	customValidator?: (value: any) => { valid: boolean; message?: string }
	/**
	 * The preset validators to use
	 */
	presets?: ValidatorPreset[]
}

export interface ValidatorNullishOptions {
	/**
	 * Whether to allow null values
	 */
	allowNull?: boolean
	/**
	 * Whether to allow undefined values
	 */
	allowUndefined?: boolean
}

export interface StringValidatorRule extends ValidatorRule {
	/**
	 * The minimum length of this string
	 */
	minLength?: number
	/**
	 * The maximum length of this string
	 */
	maxLength?: number
	/**
	 * Allowed values for this string
	 */
	enumValues?: string[]
	/**
	 * Whether this is a number stored as a string. If so, the validator will check if the string is a valid number
	 */
	isNumber?: boolean
	/**
	 * Whether this is a boolean stored as a string. If so, the validator will check if the string is a valid boolean
	 */
	isBoolean?: boolean
}

export interface NumberValidatorRule extends ValidatorRule {
	/**
	 * The minimum value of this number
	 */
	min?: number
	/**
	 * The maximum value of this number
	 */
	max?: number
	/**
	 * Whether this number must be an integer
	 */
	integer?: boolean
	/**
	 * Allowed values for this number
	 */
	enumValues?: number[]
}

export interface ArrayValidatorRule extends ValidatorRule {
	/**
	 * The minimum length of this array
	 */
	minLength?: number
	/**
	 * The maximum length of this array
	 */
	maxLength?: number
	/**
	 * The rules for the values in this array
	 * @example
	 * // This will validate an array of strings
	 * rules: [
	 *  { type: String }
	 * ]
	 * @example
	 * // This will validate an array of objects and each object must have a name and age field
	 * rules: [
	 * {
	 * 	name: { type: String },
	 * 	age: { type: Number }
	 * }
	 * ]
	 */
	expectedTypes?: [string | number | boolean | Array<unknown> | object[]]
}

export interface ObjectValidatorRule extends ValidatorRule {
	/**
	 * The rules for the values in this object
	 * @example
	 * // This will validate an object with a name and age field
	 * rules: {
	 * 	name: { type: String },
	 * 	age: { type: Number }
	 * }
	 * @example
	 * // This will validate an object with a name and age field and the age field must be an integer
	 * rules: {
	 * 	name: { type: String },
	 * 	age: { type: Number, integer: true }
	 * }
	 */
	rules?: ValidatorRuleUnion[]
}

export interface ValidatorPreset {
	/**
	 * The identifying name of the preset
	 */
	name: string
	/**
	 * The function to run which validates the value
	 */
	customValidator?: (value: any) => { valid: boolean; message?: string }
}

export interface ValidatorRules {
	[name: string]: ValidatorRule
}

export enum ValidatorRuleType {
	String = "string",
	Number = "number",
	Boolean = "boolean",
	Object = "object",
	Array = "array"
}

//union type of all validator rules
export type ValidatorRuleUnion = StringValidatorRule | NumberValidatorRule | ArrayValidatorRule | ObjectValidatorRule
