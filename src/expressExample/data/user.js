const { nanoid } = require('nanoid')

const users = [
  {
    id: nanoid(),
    name: 'Anthony',
    email: 'anthony.luzquinos@gmail.com'
  }
]

module.exports = users
