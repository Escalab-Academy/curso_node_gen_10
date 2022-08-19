const { Router } = require('express')
const { UrlService } = require('../../services')

const response = require('./response')
const UrlRouter = Router()

UrlRouter.route('/url/:userId')
  .post(async (req, res) => {
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
      console.error(error)
      response({ message: 'Internal server error', res })
    }
  })

UrlRouter.route('/url/:id')
  .get(async (req, res) => {
    const { params: { id } } = req

    try {
      const urlService = new UrlService({ id })
      const url = await urlService.getUrl()

      res.redirect(url.link)
    } catch (error) {
      console.error(error)
      response({ message: 'Internal server error', res })
    }
  })

module.exports = UrlRouter
