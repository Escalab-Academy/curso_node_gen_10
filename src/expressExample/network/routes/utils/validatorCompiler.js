const httpErrors = require('http-errors')
const Ajv = require('ajv')
const addFormats = require('ajv-formats')

const ajv = addFormats(
  new Ajv({
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true
  }),
  ['email']
)
  .addKeyword('kind')
  .addKeyword('modifier')

/**
 * @param {Object} schema
 * @param {'body'|'params'} value
 */
const validatorCompiler = (schema, value) => {
  return (req, res, next) => {
    const validate = ajv.compile(schema)
    const ok = validate(req[value])

    if (!ok && validate.errors) {
      const [error] = validate.errors
      const errorMessage = `${error.instancePath} ${error.message}`

      return next(new httpErrors.UnprocessableEntity(errorMessage))
    }

    next()
  }
}

module.exports = validatorCompiler
