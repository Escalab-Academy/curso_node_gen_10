const { Type } = require('@sinclair/typebox')

const storeUserSchema = Type.Object({
  name: Type.String({ minLength: 2 }),
  lastName: Type.String({ minLength: 2 }),
  email: Type.String({ format: 'email' })
})

const updateUserSchema = Type.Object({
  name: Type.Optional(Type.String({ minLength: 2 })),
  lastName: Type.Optional(Type.String({ minLength: 2 })),
  email: Type.Optional(Type.String({ format: 'email' }))
})

const userIDSchema = Type.Object({
  id: Type.String({ minLength: 21, maxLength: 21 })
})

module.exports = {
  storeUserSchema,
  updateUserSchema,
  userIDSchema
}
