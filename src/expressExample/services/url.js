const httpErrors = require('http-errors')
const { nanoid } = require('nanoid')

const UserService = require('./user')
const {
  mongo: { queries }
} = require('../database')
const {
  url: { saveUrl, getOneUrl }
} = queries

class UrlService {
  #id
  #link
  #userId

  /**
   * @param {Object} args
   * @param {String|undefined} args.id
   * @param {String|undefined} args.link
   * @param {String|undefined} args.userId
   */
  constructor(args) {
    const { id = '', link = '', userId = '' } = args

    this.#id = id
    this.#link = link
    this.#userId = userId
  }

  async saveUrl() {
    if (!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: userId')

    const userService = new UserService(this.#userId)
    const foundUser = await userService.verifyUserExists()

    const newUrl = await saveUrl({
      id: nanoid(6),
      link: this.#link,
      userId: foundUser._id // Mongo user id
    })

    return newUrl.toObject()
  }

  async getUrl() {
    if (!this.#id) throw new httpErrors.BadRequest('Missing required field: id')

    const foundUrl = await getOneUrl(this.#id)

    if (!foundUrl) throw new httpErrors.NotFound('Url not found')

    return foundUrl
  }
}

module.exports = UrlService
