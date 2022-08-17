const { UrlModel } = require('../models')

/**
 * @param {String} id
 * @param {String} link
 * @returns saved url
 */
const saveUrl = async (id, link) => {
  const url = new UrlModel({ id, link })

  await url.save()

  return url
}

/**
 * @param {String} id
 * @returns found url
 */
const getOneUrl = async id => {
  const urls = await UrlModel.find({ id })

  return urls[0]
}

module.exports = {
  saveUrl,
  getOneUrl
}
