const { Router } = require('express')
const { nanoid } = require('nanoid')

const {
  user: {
    storeUserSchema,
    updateUserSchema,
    userIDSchema
  }
} = require('../../schemas')
const { validatorCompiler } = require('./utils')
const { mongo: { queries } } = require('../../database')
const response = require('./response')

const UserRouter = Router()
const {
  user: {
    getAllUsers,
    saveUser,
    removeOneUser,
    updateOneUser,
    getOneUser
  }
} = queries

UserRouter.route('/user')
  .get(async (req, res, next) => {
    try {
      const users = await getAllUsers()

      response({ error: false, message: users, res, status: 200 })
    } catch (error) {
      next(error)
    }
  })
  .post(
    validatorCompiler(storeUserSchema, 'body'),
    async (req, res, next) => {
      try {
        const { body: { name, lastName, email } } = req

        await saveUser({
          id: nanoid(),
          name,
          lastName,
          email
        })
        response({ error: false, message: await getAllUsers(), res, status: 201 })
      } catch (error) {
        next(error)
      }
    }
  )

UserRouter.route('/user/:id')
  .get(
    validatorCompiler(userIDSchema, 'params'),
    async (req, res, next) => {
      try {
        const { params: { id } } = req
        const user = await getOneUser(id)

        response({ error: false, message: user, res, status: 200 })
      } catch (error) {
        next(error)
      }
    }
  )
  .delete(
    validatorCompiler(userIDSchema, 'params'),
    async (req, res, next) => {
      try {
        const { params: { id } } = req

        await removeOneUser(id)
        response({ error: false, message: await getAllUsers(), res, status: 200 })
      } catch (error) {
        next(error)
      }
    }
  )
  .patch(
    validatorCompiler(userIDSchema, 'params'),
    validatorCompiler(updateUserSchema, 'body'),
    async (req, res, next) => {
      const {
        body: { name, lastName, email  },
        params: { id }
      } = req

      try {
        await updateOneUser({ id, name, lastName, email })
        response({ error: false, message: await getAllUsers(), res, status: 200 })
      } catch (error) {
        next(error)
      }
    }
  )

module.exports = UserRouter

// JSON - DIC - BSON