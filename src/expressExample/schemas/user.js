const { Type } = require('@sinclair/typebox')

const storeUserSchema = Type.Object({
  name: Type.String({ minLength: 2 }),
  lastName: Type.String({ minLength: 2 }),
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 8 })
})

const updateUserSchema = Type.Partial(storeUserSchema)

const userIDSchema = Type.Object({
  id: Type.String({ minLength: 21, maxLength: 21 })
})

const userLoginSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 8 })
})

module.exports = {
  storeUserSchema,
  updateUserSchema,
  userIDSchema,
  userLoginSchema
}
