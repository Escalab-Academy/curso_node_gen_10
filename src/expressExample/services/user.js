const httpErrors = require('http-errors')
const { mongo: { queries } } = require('../database')
const { user: { getOneUser } } = queries

class UserService {
  #userId

  /**
   * @param {String|undefined} userId
   */
  constructor(userId = '') {
    this.#userId = userId
  }

  async verifyUserExists() {
    if (!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: userId')

    const user = await getOneUser(this.#userId)

    if (!user) throw new httpErrors.NotFound('User not found')

    return user
  }
}

module.exports = UserService
