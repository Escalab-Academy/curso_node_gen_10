const { Router } = require('express')
const { nanoid } = require('nanoid')
const { mongo: { queries } } = require('../../database')

const response = require('./response')
const { url: { saveUrl, getOneUrl } } = queries
const UrlRouter = Router()

UrlRouter.route('/url')
  .post(async (req, res) => {
    const { body: { link } } = req

    try {
      const result = await saveUrl(nanoid(6), link)

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
      const url = await getOneUrl(id)

      res.redirect(url.link)
    } catch (error) {
      console.error(error)
      response({ message: 'Internal server error', res })
    }
  })

module.exports = UrlRouter
