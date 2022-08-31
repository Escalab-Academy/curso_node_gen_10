const { Type } = require('@sinclair/typebox')

const storeRoleSchema = Type.Object({
  name: Type.String({ minLength: 2 }),
  id: Type.Integer()
})

module.exports = {
  storeRoleSchema
}
