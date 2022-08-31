const { RoleModel } = require('../models')

/**
 * It takes a role object, creates a new RoleModel instance, saves it, and returns
 * the saved role
 * @param {Object} role
 * @param {String} role.id
 * @param {String} role.name
 * @returns The savedRole is being returned.
 */
const saveRole = async role => {
  const savedRole = new RoleModel(role)

  await savedRole.save()

  return savedRole
}

/**
 * Get a role by its ID.
 * @param {String} id
 * @returns The first role in the array of roles.
 */
const getRoleByID = async id => {
  const roles = await RoleModel.find({ id })

  return roles[0]
}

/**
 * Get the role by name.
 * @param {String} name
 * @returns The first role in the array of roles.
 */
const getRoleByName = async name => {
  const roles = await RoleModel.find({ name })

  return roles[0]
}

module.exports = {
  saveRole,
  getRoleByID,
  getRoleByName
}
