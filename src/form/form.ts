/**
 * @module Form
 * @author Simon Leigh
 *
 * Essentially a collection type for the
 * Field module. CRUD functionality as well
 * as validity check
 *
 * Built in functional style with curried functions
 * and immutability.
 *
 */
import * as F from "./field";

/**
 * @typedef Form
 *
 * Form type, this is really just the internal representation
 * and should not be used directly.
 * Use form() builder function to create a form.
 *
 */
export type Form<T> = ReadonlyArray<Field<T>>;

/**
 * @typedef Field
 *
 * Reexport of F.Field.
 * Reexporting allows for greater decoupling between modules.
 */
export type Field<T> = F.Field<T>;

/**
 * @typedef FormErrors
 *
 * Internal type for the return type of a forms errors.
 */
interface FormErrors {
  [key: string]: string[];
}

/**
 * @typedef Insertable
 *
 * Type used to create forms and insert new fields into the form
 */
export type Insertable<T> = Partial<Field<T>> & { name: string; validation: T };

/**
 * @typedef ChangeSet
 *
 * Change set type for updates to existing Fields inside the
 * form. When creating a ChangeSet it is highly recommended
 * to type hint the variable. Otherwise you can get some
 * wacky type errors when interacting with curried functions.
 *
 * @example
 *  let changeSet: ChangeSet<string> = {name: "name", value: "new value"}
 *
 */
export type ChangeSet<T> = Partial<Field<T>> & { name: string };

/**
 * @typedef ValidationContext
 *
 * Context passed to the validation function generated by the
 * given factory function.
 * name: string => value: string object of the Form's fields.
 * Often used to apply group validation to a field.
 *
 */
type ValidationContext = {
  [key: string]: string | string[];
};

/**
 * @typedef ValidationFactory
 *
 * ValidationFactory function type.
 * Is a function which takes the validation config (T) and
 * required parameter (boolean) and returns a function
 * which takes a string value and a ValidationContext
 * which itself returns a string[] of errors.
 * An empty [] signals a passing test.
 *
 * It is highly recommended (and generally necessary) to
 * type hint the validation parameter on the factory function.
 * Otherwise probably going to have type errors all over.
 *
 */
type ValidationFactory<T> = (
  validation: T,
  required: boolean
) => (value: string | string[], context: ValidationContext) => string[];

/**
 * Create a new form.
 * Inserted fields will always be inserted as unverified.
 * Form must be revalidated before it will appear as valid.
 *
 * @param {ReadonlyArray<Insertable<T>>} fields
 * @return {Form<T>}
 *
 * @example
 *
 *  const field = Field.unverified("email", "", "email", true)
 *  const form = Form.form([field])
 *
 */
type create = <T>(fields: ReadonlyArray<Insertable<T>>) => Form<T>;
export const form: create = fields =>
  fields.reduce((form, field) => insert(field)(form), empty(fields));

// fucky type system, there must be a better way...
const empty: create = fields => [];

/**
 * Insert a new field into a form returning a new form.
 * Inserted field will always be inserted as unverified.
 * Form must be revalidated before it will appear as valid.
 *
 * @param {Insertable<T>} field
 * @param {Form<T>} form
 * @return {Form<T>}
 *
 * @example
 *
 *  const field = Field.unverified("email", "", "email", true)
 *  let form = Form.form([field])
 *  const addPhone = Form.insert(Field.unverified("phone", "", "phone", required))
 *  form = addPhone(form)
 *
 */
type insert = <T>(field: Insertable<T>) => (form: Form<T>) => Form<T>;
export const insert: insert = field => form => {
  if (has(field.name)(form)) {
    return update(field, form);
  }
  return form.concat([fromInsertable(field)]);
};

/**
 * Update a field in the form returning a new form.
 * Dirties the updated field causing it to be of type
 * DirtyField<T>.
 *
 * @param {ChangeSet<T>} changeSet
 * @param {Form<T>} form
 * @return {Form<T>}
 *
 * @example
 *
 *  const field = Field.unverified("email", "", "email", true)
 *  let form = Form.form([field])
 *  form =  Form.update({name: "email", value: "example@mail.com"}, form)
 *
 */
type update = <T>(changeSet: ChangeSet<T>, form: Form<T>) => Form<T>;
export const update: update = (ch, form) =>
  form.map(fld => (fld.name === ch.name ? updateField(ch, fld) : fld));

/**
 * Remove a field from a form returning a new form.
 *
 * @param {string} name
 * @param {Form<T>} form
 * @return {Form<T>}
 *
 * @example
 *
 *  const field = Field.unverified("email", "", "email", true)
 *  let form = Form.form([field])
 *  const removeField = Form.remove("email")
 *  form = removeField(form)
 *
 */
type remove = (name: string) => <T>(form: Form<T>) => Form<T>;
export const remove: remove = name => form =>
  form.filter(field => field.name !== name);

/**
 * Gets a field from a form returning either Field<T> or null.
 *
 * @param {string} name
 * @param {Form<T>} form
 * @return {Field<T> | null}
 *
 * @example
 *
 *  const field = Field.unverified("email", "", "email", true)
 *  const form = Form.form([field])
 *
 *  const getField = Form.get("email")
 *  const fieldRef = getField(form) // Field<T>
 *
 *  const getNonField = Form.get("fuzai")
 *  const nonFieldRef = getNonField(form) // null
 *
 */
type get = (name: string) => <T>(form: Form<T>) => Field<T> | null;
export const get: get = name => form => {
  const filtered = form.filter(field => field.name === name);
  return filtered.length > 0 ? filtered[0] : null;
};

/**
 * Validates the form with a validation factory function.
 * A ValidationFactory function should accept T to generate a function
 * which accepts a string value and a ValidationContext object
 * returning a string[] of errors (empty to signal a passing result).
 * if force is set to true then it will revalidate all fields. Otherwise
 * only validates DirtyField values (NOT UnverifiedFields).
 *
 * @param {ValidationFactory<T>}
 * @param {Form<T>} form
 * @param {boolean} force
 * @return {Form<T>}
 *
 * @example
 *
 *  const validate = Form.validate((config) => (value, context) => []);
 *  form = validate(form);
 *  Form.valid(form) // true
 *
 */
type validate = <T>(
  factory: ValidationFactory<T>
) => (form: Form<T>, force?: boolean) => Form<T>;
export const validate: validate = factory => (form, force = false) => {
  const context = toValidationContext(form);
  return form.map(field => {
    if (F.isDirty(field)) {
      return validateField(field, factory, context);
    }
    return force ? validateField(field, factory, context) : field;
  });
};

/**
 * Gets all fields as an array.
 *
 * @param {Form<T>}
 * @return {ReadonlyArray<Field<T>>}
 *
 * @example
 *
 *  const field = Field.unverified("email", "", "email", true)
 *  const form = Form.form([field])
 *
 *  const all = Form.all(form) // [field]
 *
 */
type all = <T>(form: Form<T>) => ReadonlyArray<Field<T>>;
export const all: all = form => [...form];

/**
 * Check if a field by given name exists in form.
 *
 * @param {string} name
 * @param {Form<T>} form
 * @return {boolean}
 *
 * @example
 *
 *  const field = Field.unverified("email", "", "email", true)
 *  const form = Form.form([field])
 *
 *  Form.has("email") // true
 *  Form.has("fuzai") // false
 *
 */
type has = (name: string) => <T>(form: Form<T>) => boolean;
export const has: has = name => form =>
  form.reduce((acc, fld) => acc || fld.name === name, false);

/**
 * Check if all fields are ValidFields.
 *
 * @param {Form<T>} form
 * @return {boolean}
 *
 * @example
 *
 *  const field = Field.valid("email", "example@mail.com", "email", true)
 *  const field = Field.invalid("phone", "", "phone", true, ["required"])
 *  const form = Form.form([field])
 *
 *  Form.valid(form) // false
 *
 *  form = Form.remove("phone")(form)
 *  Form.valid(form) // true
 *
 */
type valid = <T>(form: Form<T>) => boolean;
export const valid: valid = form =>
  form.reduce((acc, field) => acc && F.isValid(field), true);

/**
 * Get errors of all fields. Returns an object
 * with key => value pairs for each field.
 * If a field is not invalid (including dirty and unverified)
 * the value will be an empty array.
 *
 * @param {Form<T>} form
 * @return {FormErrors}
 *
 * @example
 *
 *  const field = Field.valid("email", "example@mail.com", "email", true)
 *  const field = Field.invalid("phone", "", "phone", true, ["required"])
 *  const errors = Form.errors([field]) // {"email": [], "phone": ["required"]}
 *
 */
type errors = <T>(form: Form<T>) => FormErrors;
export const errors: errors = form => {
  return form.reduce((acc: FormErrors, field) => {
    acc[field.name] = F.isInvalid(field) ? field.errors : [];
    return acc;
  }, {});
};

// helpers

type validateField = <T>(
  field: Field<T>,
  factory: ValidationFactory<T>,
  context: ValidationContext
) => F.ValidField<T> | F.InvalidField<T>;
const validateField: validateField = (field, factory, context) => {
  const errors = factory(field.validation, field.required)(
    field.value,
    context
  );
  if (errors.length > 0) {
    return F.invalidate(field, errors);
  }
  return F.validate(field);
};

type toValidationContext = <T>(form: Form<T>) => ValidationContext;
const toValidationContext: toValidationContext = form => {
  return form.reduce((acc: ValidationContext, field) => {
    acc[field.name] = field.value;
    return acc;
  }, {});
};

type fromInsertable = <T>(ins: Insertable<T>) => Field<T>;
const fromInsertable: fromInsertable = ins =>
  F.unverified(
    ins.name,
    ins.value || "",
    ins.validation,
    ins.required || false
  );

type updateField = <T>(ch: ChangeSet<T>, field: Field<T>) => F.DirtyField<T>;
const updateField: updateField = (ch, f) =>
  F.dirty(
    ch.name,
    ch.value !== undefined ? ch.value : f.value,
    ch.validation !== undefined ? ch.validation : f.validation,
    ch.required !== undefined ? ch.required : f.required
  );
