/**
 * @module Fields
 * @author Simon Leigh
 * 
 * Field types and actions on those field types
 * representing the various states a field can be in
 * Valid, Invalid, Unverified and Dirty
 * 
 */

/**
 * The base interface for field types.
 * @typedef BaseField<T>
 * 
 * Contains name, value, validation<T> and required properties.
 * the type attribute is used internally to determine field state.
 * 
 * The type of the validation property is generic <T> to allow for various
 * forms of validation processes.
 * 
 * This is an internal type which is not exported and should not be used externally.
 */
interface BaseField<T> {
  readonly type: string;
  readonly name: string;
  readonly value: string | string[];
  readonly validation: T;
  readonly required: boolean;
}


/**
 * Representation of a valid field.
 * @typedef ValidField
 * 
 * Extends the BaseField. Is used to represent a field
 * whose value has been validated.
 */
export interface ValidField<T> extends BaseField<T> {
  readonly type: "valid";
}


/**
 * Representation of an invalid field.
 * @typedef InvalidField
 * 
 * Extends the BaseField. Is used to represent a field
 * whose value has been validated but failed.
 */
export interface InvalidField<T> extends BaseField<T> {
  readonly type: "invalid";
  readonly errors: string[];
}


/**
 * Representation of an unverified field.
 * @typedef UnverifiedField
 * 
 * Extends the BaseField. Is used to represent a field
 * whose value has not had any attempt to be validated.
 * Differing from a dirty field in that the field may contain
 * cached or default values.
 */
export interface UnverifiedField<T> extends BaseField<T> {
  readonly type: "unverified";
}


/**
 * Representation of an dirty field.
 * @typedef DirtyField
 * 
 * Extends the BaseField. Is used to represent a field
 * whose value or other attributes has been changed in some
 * way. Differs from an UnverifiedField in that it's value
 * or other attributes have been changed since initialization
 * (usually be user interaction) and required verification.
 */
export interface DirtyField<T> extends UnverifiedField<T> {
  readonly dirty: true;
}


/**
 * Union of exported Field types
 * @typedef Field
 * 
 * Union of Field types that should be used when importing
 * this module.
 */
export type Field<T> = UnverifiedField<T> | ValidField<T> | InvalidField<T>;




// Builders

/**
 * Factory function for ValidField<T>
 * 
 * @param {string} name 
 * @param {string | string[]} value
 * @param {T} validation 
 * @param {boolean} required
 * @return {ValidField} 
 * 
 * @example
 * 
 *  const validatedField = valid("email", "example@mail.com", "required|email", true)
 * 
 */
type valid = <T>(name: string, value: string | string[], validation: T, required: boolean) => ValidField<T>;
export const valid: valid = (n, vl, va, r) =>
  ({type: "valid", name: n, value: vl, validation: va, required: r});




/**
 * Factory function for UnverifiedField<T>
 * 
 * @param {string} name 
 * @param {string | string[]} value
 * @param {T} validation 
 * @param {boolean} required
 * @return {UnverifiedField} 
 * 
 * @example
 * 
 *  const unverifiedField = unverified("email", "example@mail.com", "required|email", true)
 * 
 */
type unverified = <T>(name: string, value: string | string[], validation: T, required: boolean) => UnverifiedField<T>;
export const unverified: unverified = (n, vl, va, r) =>
  ({type: "unverified", name: n, value: vl, validation: va, required: r});




/**
 * Factory function for DirtyField<T>
 * 
 * @param {string} name 
 * @param {string | string[]} value
 * @param {T} validation 
 * @param {boolean} required
 * @return {DirtyField}
 * 
 * @example
 * 
 *  const dirtyField = dirty("email", "example@mail.com", "required|email", true)
 * 
 */
type dirty = <T>(name: string, value: string | string[], validation: T, required: boolean) => DirtyField<T>;
export const dirty: dirty = (n, vl, va, r) =>
  ({type: "unverified", name: n, value: vl, validation: va, required: r, dirty: true});




/**
 * Factory function for InvalidField<T>
 * 
 * @param {string} name 
 * @param {string | string[]} value
 * @param {T} validation 
 * @param {boolean} required
 * @param {string[]} errors
 * @return {InvalidField}
 * 
 * @example
 * 
 *  const invalidField = invalid("email", "example@mail.com", "required|email", true, ["errors"])
 * 
 */
type invalid = <T>(name: string, value: string | string[], validation: T, required: boolean, errors: string[]) => InvalidField<T>;
export const invalid: invalid = (n, vl, va, r, e) =>
  ({type: "invalid", name: n, value: vl, validation: va, required: r, errors: e});




/**
 * Validate a field of any type turning it into a ValidField<T>
 * 
 * @param {Field<T>} field
 * @return {ValidField} 
 * 
 * @example
 * 
 *  const dirtyField = dirty("email", "example@mail.com", "required|email", true)
 *  const validatedField = validate(dirtyField)
 * 
 */
type validate = <T>(field: Field<T>) => ValidField<T>;
export const validate: validate = (f) =>
  valid(f.name, f.value, f.validation, f.required);




/**
 * Invalidate a field of any type turning it into a InvalidField<T>
 * 
 * @param {Field<T>} field
 * @param {string[]} errors
 * @return {InvalidField} 
 * 
 * @example
 * 
 *  const dirtyField = dirty("email", "example@mail.com", "required|email", true)
 *  const invalidatedField = invalidate(dirtyField)
 * 
 */
type invalidate = <T>(field: Field<T>, errors: string[]) => InvalidField<T>;
export const invalidate: invalidate = (f, e) =>
  invalid(f.name, f.value, f.validation, f.required, e);




/**
 * Dirties a field of any type turning it into a DirtyField<T>
 * 
 * @param {Field<T>} field
 * @return {InvalidField} 
 * 
 * @example
 * 
 *  const unverifiedField = unverified("email", "example@mail.com", "required|email", true)
 *  const dirtyField = soil(unverifiedField)
 * 
 */
type soil = <T>(field: Field<T>) => DirtyField<T>;
export const soil: soil = f =>
  dirty(f.name, f.value, f.validation, f.required);



// Getters

/**
 * Get the name of a field
 * 
 * @param {Field} field
 * @returns {string}
 * 
 * @example
 *  
 *  const field = unverified("email", "example@mail.com", "required|email", true)
 *  const fieldName = name(field) // email
 * 
 */
type name = <T>(f: Field<T>) => string;
export const name: name = f =>
  f.name;




/**
 * Get the value of a Field
 * 
 * @param {Field} field
 * @returns {string | string[]}
 * 
 * @example
 *  
 *  const field = unverified("email", "example@mail.com", "required|email", true)
 *  const fieldName = value(field) // example@mail.com
 * 
 */
type value = <T>(f: Field<T>) => string | string[];
export const value: value = f =>
  f.value;




/**
 * Get the validation of a Field
 * 
 * @param {Field<T>} field
 * @returns {T}
 * 
 * @example
 *  
 *  const field = unverified("email", "example@mail.com", "required|email", true)
 *  const fieldName = validation(field) // required|email
 * 
 */
type validation = <T>(f: Field<T>) => T;
export const validation: validation = f =>
  f.validation;




/**
 * Get the required property of a Field
 * 
 * @param {Field} field
 * @returns {string}
 * 
 * @example
 *  
 *  const field = unverified("email", "example@mail.com", "required|email", true)
 *  const fieldName = required(field) // required|email
 * 
 */
type required = <T>(f: Field<T>) => boolean;
export const required: required = f =>
  f.required;




/**
 * Get the required property of an InvalidField
 * 
 * @param {InvalidField} field
 * @returns {string}
 * 
 * @example
 *  
 *  const field = invalid("email", "example@mail.com", "required|email", true, ["invalid"])
 *  const fieldName = errors(field) // required|email
 * 
 */
type errors = <T>(f: InvalidField<T>) => string[];
export const errors: errors = f =>
  f.errors;




// Checkers

/**
 * Determines if Field is ValidField
 * 
 * @param {Field} field
 * @return {boolean}
 * 
 * If using typescript type checks the field if it is a ValidField
 * 
 * @example
 *  
 *  if (isValid(field)) {
 *    console.log(`${field.name} is valid!`)
 *  }
 */
export function isValid<T>(f: Field<T>): f is ValidField<T> {
  return f.type === "valid";
}




/**
 * Determines if Field is UnverifiedField
 * 
 * @param {Field} field
 * @return {boolean}
 * 
 * If using typescript type checks the field if it is a UnverifiedField
 * 
 * @example
 *  
 *  if (isUnverified(field)) {
 *    console.log(`${field.name} is unverified!`)
 *  }
 */
export function isUnverified<T>(f: Field<T>): f is UnverifiedField<T> {
  return f.type === "unverified";
}




/**
 * Determines if Field is DirtyField
 * 
 * @param {Field} field
 * @return {boolean}
 * 
 * If using typescript type checks the field if it is a DirtyField
 * 
 * @example
 *  
 *  if (isDirty(field)) {
 *    console.log(`${field.name} needs validation!`)
 *  }
 */
export function isDirty<T>(f: Field<T>): f is DirtyField<T> {
  return "dirty" in f;
}




/**
 * Determines if Field is InvalidField
 * 
 * @param {Field} field
 * @return {boolean}
 * 
 * If using typescript type checks the field if it is a UnverifiedField
 * 
 * @example
 *  
 *  if (isInvalid(field)) {
 *    console.log(`${field.name} has ${field.errors.length} errors!`)
 *  }
 */
export function isInvalid<T>(f: Field<T>): f is InvalidField<T> {
  return f.type === "invalid";
}
