const { Router } = require('express')
const { nanoid } = require('nanoid')

const users = require('../../data/user')
const response = require('./response')

// CRUD
/**
 * C - CREATE - POST ✅
 * R - READ - GET ✅
 * U - UPDATE - PUT, PATCH ✅
 * D - DELETE - DELETE ✅
 */
const UserRouter = Router()

// APIs: síncronas y asíncronas
// Sync: RECIBEN INFO - PROCESAN INFO - RETORNAN INFO
// Async: RECIBEN INFO - RETORNAN INFO
//            |-> PROCESAR INFO

// http://localhost:3000/user
UserRouter.route('/user')
  .get((req, res) => {
    response({ error: false, message: users, res, status: 200 })
  })
  .post((req, res) => {
    const { body: { name, email } } = req

    users.push({
      id: nanoid(),
      name,
      email
    })
    response({ error: false, message: users, res, status: 201 })
  })

UserRouter.route('/user/:id')
  .delete((req, res) => {
    const { params: { id } } = req
    const userIndex = users.findIndex(user => user.id === id)

    if (userIndex === -1)
      return response({
        message: `User with id: ${id} was not found`,
        res,
        status: 404
      })

    users.splice(userIndex, 1)
    response({ error: false, message: users, res, status: 200 })
  })
  .patch((req, res) => {
    const {
      body: { name, email },
      params: { id }
    } = req
    const userIndex = users.findIndex(user => user.id === id)

    if (userIndex === -1)
      return response({
        message: `User with id: ${id} was not found`,
        res,
        status: 404
      })

    users.splice(userIndex, 1, {
      ...users[userIndex],
      ...(name && { name }),
      ...(email && { email })
    })
    response({ error: false, message: users, res, status: 200 })
  })

module.exports = UserRouter

// JSON - DIC - BSON