const { Router } = require('express')

const {
  user: { storeUserSchema, updateUserSchema, userIDSchema, userLoginSchema }
} = require('../../schemas')
const { validatorCompiler } = require('./utils')
const response = require('./response')
const { UserService } = require('../../services')

const UserRouter = Router()

UserRouter.route('/user').get(async (req, res, next) => {
  try {
    const userService = new UserService()

    response({
      error: false,
      message: await userService.getAllUsers(),
      res,
      status: 200
    })
  } catch (error) {
    next(error)
  }
})

UserRouter.route('/user/signup').post(
  validatorCompiler(storeUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const {
        body: { name, lastName, email, password }
      } = req

      response({
        error: false,
        message: await new UserService({
          name,
          lastName,
          email,
          password
        }).saveUser(),
        res,
        status: 201
      })
    } catch (error) {
      next(error)
    }
  }
)

UserRouter.route('/user/login').post(
  validatorCompiler(userLoginSchema, 'body'),
  async (req, res, next) => {
    try {
      const {
        body: { email, password }
      } = req

      response({
        error: false,
        message: await new UserService({
          email,
          password
        }).login(),
        res,
        status: 200
      })
    } catch (error) {
      next(error)
    }
  }
)

UserRouter.route('/user/:id')
  .get(validatorCompiler(userIDSchema, 'params'), async (req, res, next) => {
    try {
      const {
        params: { id: userId }
      } = req
      const userService = new UserService({ userId })

      response({
        error: false,
        message: await userService.getUserByID(),
        res,
        status: 200
      })
    } catch (error) {
      next(error)
    }
  })
  .delete(validatorCompiler(userIDSchema, 'params'), async (req, res, next) => {
    try {
      const {
        params: { id }
      } = req
      const userService = new UserService({ userId: id })

      response({
        error: false,
        message: await userService.removeUserByID(),
        res,
        status: 200
      })
    } catch (error) {
      next(error)
    }
  })
  .patch(
    validatorCompiler(userIDSchema, 'params'),
    validatorCompiler(updateUserSchema, 'body'),
    async (req, res, next) => {
      const {
        body: { name, lastName, email, password },
        params: { id: userId }
      } = req

      try {
        response({
          error: false,
          message: await new UserService({
            userId,
            name,
            lastName,
            email,
            password
          }).updateOneUser(),
          res,
          status: 200
        })
      } catch (error) {
        next(error)
      }
    }
  )

module.exports = UserRouter
