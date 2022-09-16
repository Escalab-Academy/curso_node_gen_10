const { Router } = require('express')

const response = require('./response')
const HomeRouter = Router()

HomeRouter.route('/').get((req, res) => {
  response({
    error: false,
    message: 'Hello world from Escalab Gen 10 Node.js course!',
    res,
    status: 200
  })
})

module.exports = HomeRouter
