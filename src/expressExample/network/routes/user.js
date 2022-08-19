const { Router } = require('express')
const { nanoid } = require('nanoid')

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
  .get(async (req, res) => {
    try {
      const users = await getAllUsers()

      response({ error: false, message: users, res, status: 200 })
    } catch (error) {
      console.error(error)
      response({ message: 'Internal server error', res })
    }
  })
  .post(async (req, res) => {
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
      console.error(error)
      response({ message: 'Internal server error', res })
    }
  })

UserRouter.route('/user/:id')
  .get(async (req, res) => {
    try {
      const { params: { id } } = req
      const user = await getOneUser(id)

      response({ error: false, message: user, res, status: 200 })
    } catch (error) {
      console.error(error)
      response({ message: 'Internal server error', res })
    }
  })
  .delete(async (req, res) => {
    try {
      const { params: { id } } = req

      await removeOneUser(id)
      response({ error: false, message: await getAllUsers(), res, status: 200 })
    } catch (error) {
      console.error(error)
      response({ message: 'Internal server error', res })
    }
  })
  .patch(async (req, res) => {
    const {
      body: { name, lastName, email  },
      params: { id }
    } = req

    try {
      await updateOneUser({ id, name, lastName, email })
      response({ error: false, message: await getAllUsers(), res, status: 200 })
    } catch (error) {
      console.error(error)
      response({ message: 'Internal server error', res })
    }
  })

module.exports = UserRouter

// JSON - DIC - BSON