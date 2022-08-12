/**
 * @param {Object} args
 * @param {Boolean} args.error
 * @param {Object} args.message
 * @param {Number} args.status
 * @param {import('express').Response} args.res
 */
const response = ({ error = true, message, status = 500, res }) => {
  res.status(status).send({ error, message })
}

module.exports = response
