import * as Field from "./field"

type FField = Field.Field
type Form = { [key: string]: FField}

type insert = (form: Form) => (field: FField) => Form
export const insert: insert
  = form => field => form.hasOwnProperty(field.name) ? form : Form(fields(form))

type makeForm = (fields: FField[]) => Form
const fromList: makeForm
  = fields => fields.reduce((form: Form, field: FField) => insert(form)(field), {})

const fromForm = Form

type toList = (form: Form) => FField[]
const toList: toList
  = form => Object.keys(form).map((key) => form[key])

type hasField = (form: Form) => ""
