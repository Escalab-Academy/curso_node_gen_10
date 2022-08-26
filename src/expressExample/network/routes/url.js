const { Router } = require('express')
const { UrlService } = require('../../services')

const response = require('./response')
const UrlRouter = Router()

UrlRouter.route('/url/:userId').post(async (req, res, next) => {
  const {
    body: { link },
    params: { userId }
  } = req
  const urlService = new UrlService({ link, userId })

  try {
    const result = await urlService.saveUrl()

    response({
      error: false,
      message: result,
      res,
      status: 201
    })
  } catch (error) {
    next(error)
  }
})

UrlRouter.route('/url/:id').get(async (req, res, next) => {
  const {
    params: { id }
  } = req

  try {
    const urlService = new UrlService({ id })
    const url = await urlService.getUrl()

    res.redirect(url.link)
  } catch (error) {
    next(error)
  }
})

module.exports = UrlRouter
