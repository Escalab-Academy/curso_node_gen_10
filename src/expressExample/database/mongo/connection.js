const { connect, connection } = require('mongoose')

const dbConnection = () => {
  connection.on('connected', () => {
    console.log('MongoDB connection established.')
  })
  connection.on('reconnected', () => {
    console.log('MongoDB connection established.')
  })
  connection.on('close', () => {
    console.log('MongoDB connection closed.')
  })
  connection.on('error', error => {
    console.log('Mongo connection error:')
    console.error(error)
  })

  const connectionConfig = {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  }

  return {
    connect: () => connect(process.env.MONGO_URI, connectionConfig),
    disconnect: () => connection.close()
  }
}

module.exports = dbConnection
