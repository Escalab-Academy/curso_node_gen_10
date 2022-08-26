const { createHash } = require('node:crypto')
const { nanoid } = require('nanoid')

/**
 * It takes a string and a salt, and returns an object with the salt and the
 * hashed string
 * @param {String} string - The string to hash.
 * @param {String|undefined} salt - A random string of characters that is used
 * to make the hash more secure.
 * @returns An object with two properties: salt and result.
 */
const hashString = (string, salt = '') => {
  const newSalt = !salt ? nanoid(30) : salt
  const hash = createHash('sha256')

  hash.update(`${string}${newSalt}`)

  const result = hash.digest('hex')

  return { salt: newSalt, result }
}

module.exports = { hashString }
