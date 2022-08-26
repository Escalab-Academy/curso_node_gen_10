const httpErrors = require('http-errors')
const { nanoid } = require('nanoid')

const {
  mongo: { queries }
} = require('../database')
const {
  user: { getUserByID, saveUser, getAllUsers, removeUserByID, updateOneUser }
} = queries

class UserService {
  #userId
  #name
  #lastName
  #email

  /**
   * @param {Object} args
   * @param {String} args.userId
   * @param {String} args.name
   * @param {String} args.lastName
   * @param {String} args.email
   */
  constructor(args) {
    const { userId = '', name = '', lastName = '', email = '' } = args

    this.#userId = userId
    this.#name = name
    this.#lastName = lastName
    this.#email = email
  }

  async verifyUserExists() {
    if (!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: userId')

    const user = await getUserByID(this.#userId)

    if (!user) throw new httpErrors.NotFound('User not found')

    return user
  }

  async saveUser() {
    if (!this.#name)
      throw new httpErrors.BadRequest('Missing required field: name')

    if (!this.#lastName)
      throw new httpErrors.BadRequest('Missing required field: lastName')

    if (!this.#email)
      throw new httpErrors.BadRequest('Missing required field: email')

    await saveUser({
      id: nanoid(),
      name: this.#name,
      lastName: this.#lastName,
      email: this.#email
    })

    return await getAllUsers()
  }

  async getUserByID() {
    if (!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: userId')

    const user = await getUserByID(this.#userId)

    if (!user)
      throw new httpErrors.NotFound('The requested user does not exists')

    return user
  }

  async getAllUsers() {
    return await getAllUsers()
  }

  async removeUserByID() {
    if (!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: userId')

    const user = await removeUserByID(this.#userId)

    if (!user)
      throw new httpErrors.NotFound('The requested user does not exists')

    return user
  }

  async updateOneUser() {
    if (!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: userId')

    return await updateOneUser({
      id: this.#userId,
      name: this.#name,
      lastName: this.#lastName,
      email: this.#email
    })
  }
}

module.exports = UserService
