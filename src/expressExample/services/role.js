const httpErrors = require('http-errors')

const {
  mongo: { queries }
} = require('../database')
const {
  role: { ROLE_IDS, ROLE_NAMES }
} = require('../utils')
const {
  role: { saveRole, getRoleByID, getRoleByName }
} = queries

class RoleService {
  #id
  #name

  /**
   * @param {Object} args
   * @param {String} args.id
   * @param {String} args.name
   */
  constructor(args = {}) {
    const { id, name = '' } = args

    if (!ROLE_IDS.includes(`${id}`))
      throw new httpErrors.BadRequest('Role ID not allowed')

    this.#id = id
    this.#name = name
  }

  async saveRole() {
    if (!ROLE_NAMES.includes(this.#name))
      throw new httpErrors.BadRequest('Role name not allowed')

    const roleExists = await getRoleByName(this.#name)

    if (roleExists) throw new httpErrors.Conflict('Role already exists')

    return await saveRole({ id: this.#id, name: this.#name })
  }

  async getRoleByID() {
    return await getRoleByID(this.#id)
  }
}

module.exports = RoleService
