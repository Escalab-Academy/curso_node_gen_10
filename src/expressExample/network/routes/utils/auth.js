const jwt = require('jsonwebtoken')
const httpErrors = require('http-errors')

const { UserService } = require('../../../services')

const NOT_ALLOWED_TO_BE_HERE = 'You are not allowed here!'

/**
 * @param {String} authorization
 */
const getToken = authorization => {
  if (!authorization) throw new httpErrors.Unauthorized(NOT_ALLOWED_TO_BE_HERE)

  const [tokenType, token] = authorization.split(' ')

  if (tokenType !== 'Bearer')
    throw new httpErrors.Unauthorized(NOT_ALLOWED_TO_BE_HERE)

  return token
}

const validateUserPayload = payload => {
  const { email, password, iat, exp, ...rest } = payload

  if (!email) throw new httpErrors.Unauthorized(NOT_ALLOWED_TO_BE_HERE)

  if (!password) throw new httpErrors.Unauthorized(NOT_ALLOWED_TO_BE_HERE)

  if (Object.keys(rest).length !== 0)
    throw new httpErrors.Unauthorized(NOT_ALLOWED_TO_BE_HERE)

  return { email, password }
}

/**
 *
 * @param {Object} error
 * @param {import('express').NextFunction} next
 */
const handleError = (error, next) => {
  console.error('error', error)

  if (error instanceof jwt.TokenExpiredError)
    return next(new httpErrors.Unauthorized('Session expired!'))

  if (error instanceof httpErrors.Unauthorized) return next(error)

  return next(new httpErrors.Unauthorized(NOT_ALLOWED_TO_BE_HERE))
}

const generateTokens = () => {
  return (req, res, next) => {
    const {
      body: { email, password }
    } = req

    const payload = { email, password }
    const accessToken = jwt.sign(payload, process.env.SECRET, {
      expiresIn: '10min'
    })
    const refreshToken = jwt.sign(payload, process.env.SECRET, {
      expiresIn: '1h'
    })

    req.accessToken = accessToken
    req.refreshToken = refreshToken
    next()
  }
}

const verifyUser = () => {
  return async (req, res, next) => {
    try {
      const {
        headers: { authorization }
      } = req
      const token = getToken(authorization)
      const payload = jwt.verify(token, process.env.SECRET)
      const { email, password } = validateUserPayload(payload)
      const isLoginCorrect = Boolean(
        await new UserService({ email, password }).login()
      )

      if (isLoginCorrect) return next()

      return next(new httpErrors.Unauthorized(NOT_ALLOWED_TO_BE_HERE))
    } catch (error) {
      return handleError(error, next)
    }
  }
}

const verifyIsCurrentUser = () => {
  return async (req, res, next) => {
    try {
      const {
        params: { id: userId },
        headers: { authorization }
      } = req
      const token = getToken(authorization)
      const payload = jwt.verify(token, process.env.SECRET)
      const { email, password } = validateUserPayload(payload)
      const user = await new UserService({ email, password }).login()
      const isLoginCorrect = Boolean(user)

      if (isLoginCorrect && user.id === userId) return next()

      return next(new httpErrors.Unauthorized(NOT_ALLOWED_TO_BE_HERE))
    } catch (error) {
      return handleError(error, next)
    }
  }
}

const refreshAccessToken = () => {
  return async (req, res, next) => {
    try {
      const {
        params: { id: userId },
        headers: { authorization }
      } = req
      const token = getToken(authorization)
      const payload = jwt.verify(token, process.env.SECRET)
      const { email, password } = validateUserPayload(payload)
      const user = await new UserService({ email, password }).login()
      const isLoginCorrect = Boolean(user)

      if (!(isLoginCorrect && user.id === userId))
        throw new httpErrors.Unauthorized(NOT_ALLOWED_TO_BE_HERE)

      const accessToken = jwt.sign({ email, password }, process.env.SECRET, {
        expiresIn: '10min'
      })

      req.accessToken = accessToken
      req.refreshToken = token
      next()
    } catch (error) {
      return handleError(error, next)
    }
  }
}

module.exports = {
  generateTokens,
  verifyUser,
  verifyIsCurrentUser,
  refreshAccessToken
}
