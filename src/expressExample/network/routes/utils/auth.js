const jwt = require('jsonwebtoken')
const httpErrors = require('http-errors')

const { UserService } = require('../../../services')

const NOT_ALLOWED_TO_BE_HERE = 'You are not allowed here!'

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

      if (!authorization)
        return next(new httpErrors.Unauthorized(NOT_ALLOWED_TO_BE_HERE))

      const [tokenType, token] = authorization.split(' ')

      if (tokenType !== 'Bearer')
        return next(new httpErrors.Unauthorized(NOT_ALLOWED_TO_BE_HERE))

      const payload = jwt.verify(token, process.env.SECRET)
      const { email, password, iat, exp, ...rest } = payload

      if (!email)
        return next(new httpErrors.Unauthorized(NOT_ALLOWED_TO_BE_HERE))

      if (!password)
        return next(new httpErrors.Unauthorized(NOT_ALLOWED_TO_BE_HERE))

      if (Object.keys(rest).length !== 0)
        return next(new httpErrors.Unauthorized(NOT_ALLOWED_TO_BE_HERE))

      const isLoginCorrect = Boolean(
        await new UserService({ email, password }).login()
      )

      if (isLoginCorrect) return next()

      return next(new httpErrors.Unauthorized(NOT_ALLOWED_TO_BE_HERE))
    } catch (error) {
      console.error('error', error)
      if (error instanceof jwt.TokenExpiredError)
        return next(new httpErrors.Unauthorized('Session expired!'))

      next(new httpErrors.Unauthorized(NOT_ALLOWED_TO_BE_HERE))
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

      if (!authorization)
        return next(new httpErrors.Unauthorized(NOT_ALLOWED_TO_BE_HERE))

      const [tokenType, token] = authorization.split(' ')

      if (tokenType !== 'Bearer')
        return next(new httpErrors.Unauthorized(NOT_ALLOWED_TO_BE_HERE))

      const payload = jwt.verify(token, process.env.SECRET)
      const { email, password, iat, exp, ...rest } = payload

      if (!email)
        return next(new httpErrors.Unauthorized(NOT_ALLOWED_TO_BE_HERE))

      if (!password)
        return next(new httpErrors.Unauthorized(NOT_ALLOWED_TO_BE_HERE))

      if (Object.keys(rest).length !== 0)
        return next(new httpErrors.Unauthorized(NOT_ALLOWED_TO_BE_HERE))

      const user = await new UserService({ email, password }).login()
      const isLoginCorrect = Boolean(user)

      if (isLoginCorrect && user.id === userId) return next()

      return next(new httpErrors.Unauthorized(NOT_ALLOWED_TO_BE_HERE))
    } catch (error) {
      console.error('error', error)
      if (error instanceof jwt.TokenExpiredError)
        return next(new httpErrors.Unauthorized('Session expired!'))

      next(new httpErrors.Unauthorized(NOT_ALLOWED_TO_BE_HERE))
    }
  }
}

module.exports = {
  generateTokens,
  verifyUser,
  verifyIsCurrentUser
}
