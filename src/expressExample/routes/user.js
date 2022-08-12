const { Router } = require('express')

const users = require('../data/user')

// CRUD
/**
 * C - CREATE - POST
 * R - READ - GET ✅
 * U - UPDATE - PUT, PATCH
 * D - DELETE - DELETE
 */
const UserRouter = Router()

// APIs: síncronas y asíncronas
// Sync: RECIBEN INFO - PROCESAN INFO - RETORNAN INFO
// Async: RECIBEN INFO - RETORNAN INFO
//            |-> PROCESAR INFO

// http://localhost:3000/user
UserRouter.route('/user')
  .get((req, res) => {
    res.send({
      message: users,
      error: false
    })
  })
  .post((req, res) => {
    const { body: { name, email } } = req

    users.push({
      id: `${Date.now()}`,
      name,
      email
    })
    res.status(201).send({
      message: users,
      error: false
    })
  })

module.exports = UserRouter
