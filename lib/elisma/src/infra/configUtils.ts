import { Optional } from '@quorum/lib/elisma/src/infra/Optional'

/** Returns an array of strings from an environment variable of type string with elements separated by commas.
 *
 * @param variableName {string} Name of the environment variable.
 * @param required {boolean} True to verify that the variable exists, false otherwise.
 * @returns {Optional<string[]>} array of strings or undefined.
 */
function readStringArray(variableName: string, required: boolean): Optional<string[]> {
  const value: Optional<string> = readValue(variableName, required)
  return value?.split(',').map((element: any) => element.trim())
}

/** Returns an array of numbers from an environment variable of type string with numbers separated by commas.
 *
 * @param variableName {string} Name of the environment variable.
 * @param required {boolean} True to verify that the variable exists, false otherwise.
 * @returns {Optional<number[]>} array of numbers or undefined.
 */
function readNumberArray(variableName: string, required: boolean): Optional<number[]> {
  const arrayValue: Optional<string[]> = readStringArray(variableName, required)
  return arrayValue?.map((element: any) => +element)
}

/** Ensures a value is not undefined.
 *
 * It throws an error if the value is undefined, otherwise it returns the not-null value.
 *
 * @param value {T}Value to verify.
 * @returns {T} the not-null value.
 */
export function required<T>(value?: T): T {
  if (value === undefined) {
    throw new Error('value is required')
  }
  return value
}

/** Returns the value of an environment variable.
 *
 * @param variableName {string} Name of the environment variable.
 * @param required {boolean} True to verify that the variable exists, false otherwise.
 * @returns {Optional<string>} the environment variable value, if it does exist.
 */
export function readValue(variableName: string, required: boolean): Optional<string> {
  if (required && process.env[variableName] === undefined) {
    throw new Error(`required variable ${variableName} not found in the environment`)
  }
  // Returns the variable value or undefined if it does not exist or is empty
  return process.env[variableName] || undefined
}

/** Resolves a required environment variable of type string.
 * @param variableName {string} Name of the required variable.
 * @returns {string} the variable value.
 */
export function string(variableName: string): string {
  return required(readValue(variableName, true))
}

/** Resolves an optional environment variable of type string.
 * @param variableName {string} Name of the required variable.
 * @param defaultValue {Optional<string>} The default value to return if the variable does not exist.
 * @returns {Optional<string>} the variable value, or undefined if it does not exist.
 */
export function optString(variableName: string, defaultValue?: string): Optional<string> {
  return readValue(variableName, false) || defaultValue
}

/** Resolves a required environment variable of type number.
 * @param variableName {string} Name of the required variable.
 * @returns {number} the variable value.
 */
export function number(variableName: string): number {
  return required(optNumber(variableName))
}

/** Resolves an optional environment variable of type number.
 * @param variableName {Optional<number>} Name of the required variable.
 * @param defaultValue The default value to return if the variable does not exist.
 * @returns {Optional<number>} the variable value, or undefined if it does not exist.
 */
export function optNumber(variableName: string, defaultValue?: number): Optional<number> {
  const value: Optional<string> = readValue(variableName, false)
  const numberValue: Optional<number> = value ? +value : undefined

  if (numberValue && isNaN(numberValue)) {
    throw new Error(`the value for variable ${variableName} must be a number`)
  }
  return numberValue || defaultValue
}

/** Resolves a required environment variable of type boolean.
 * @param variableName {string} Name of the required variable.
 * @returns {boolean} the variable value.
 */
export function boolean(variableName: string): boolean {
  return required(optBoolean(variableName))
}

/** Resolves an optional environment variable of type boolean.
 * @param variableName {string} Name of the required variable.
 * @param defaultValue {boolean} The default value to return if the variable does not exist.
 * @returns {Optional<boolean>} the variable value, or undefined if it does not exist.
 */
export function optBoolean(variableName: string, defaultValue?: boolean): Optional<boolean> {
  const value: Optional<string> = readValue(variableName, false)

  if (value === undefined) {
    return defaultValue
  } else if (value === 'true') {
    return true
  } else if (value === 'false') {
    return false
  } else {
    throw new Error(`invalid boolean value for variable ${variableName}: ${value}`)
  }
}

/** Resolves an optional environment variable of type string to an array of strings.
 *  The elements must be separated by commas.
 *
 * @param variableName {string} Name of the required variable.
 * @param defaultValue {Optional<string[]>} The default value to return if the variable does not exist.
 * @returns {string[]} array of strings or an empty array.
 */
export function optStringArray(variableName: string, defaultValue?: string[]): string[] {
  return readStringArray(variableName, false) || defaultValue || []
}

/** Resolves a required environment variable of type string to an array of strings.
 *  The elements must be separated by commas.
 *
 * @param variableName {string} Name of the required variable.
 * @returns {string[]} array of strings.
 */
export function stringArray(variableName: string): string[] {
  return required(readStringArray(variableName, true))
}

/** Resolves an optional environment variable of type string to an array of numbers.
 *  The numbers must be separated by commas.
 *
 * @param variableName {string} Name of the required variable.
 * @param defaultValue {Optional<number[]>} The default value to return if the variable does not exist.
 * @returns {number[]} array of numbers or an empty array.
 */
export function optNumberArray(variableName: string, defaultValue?: number[]): number[] {
  return readNumberArray(variableName, false) || defaultValue || []
}

/** Resolves a required environment variable of type string to an array of numbers.
 *  The elements must be separated by commas.
 *
 * @param variableName {string} Name of the required variable.
 * @returns {number[]} array of numbers.
 */
export function numberArray(variableName: string): number[] {
  return required(readNumberArray(variableName, true))
}
