const { UrlModel } = require('../models')

/**
 * @param {Object} url
 * @param {String} url.id
 * @param {String} url.link
 * @param {String} url.userId mongo user id
 * @returns saved url
 */
const saveUrl = async url => {
  const savedUrl = new UrlModel(url)

  await savedUrl.save()

  return savedUrl
}

/**
 * @param {String} id
 * @returns found url
 */
const getOneUrl = async id => {
  const urls = await UrlModel.find({ id }).populate('userId')

  return urls[0]
}

module.exports = {
  saveUrl,
  getOneUrl
}
