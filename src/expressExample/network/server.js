const express = require('express')
const morgan = require('morgan')

const {
  mongo: { dbConnection }
} = require('../database')
const applyRoutes = require('./router')

const PORT = process.env.PORT || '1996'

class Server {
  #app
  #connection
  #server

  constructor() {
    this.#app = express()
    this.#connection = dbConnection()
    this.#config()
  }

  #config() {
    this.#app.use(express.json())
    this.#app.use(morgan('dev'))
    this.#app.use(express.urlencoded({ extended: false }))
    applyRoutes(this.#app)
  }

  async start() {
    try {
      await this.#connection.connect()
      this.#server = this.#app.listen(PORT, () => {
        console.log(`Server running at port ${PORT}.`)
      })
    } catch (error) {
      console.error(error)
    }
  }

  async stop() {
    try {
      await this.#connection.disconnect()
      this.#server?.close()
    } catch (error) {
      console.error(error)
    }
  }
}

const server = new Server()

module.exports = server
