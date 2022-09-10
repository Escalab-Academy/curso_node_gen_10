const axios = require('axios')

const { server } = require('../../src/expressExample/network')

const URL = `http://localhost:${process.env.PORT || 1996}/`

beforeAll(async () => {
  await server.start()
})

afterAll(async () => {
  await server.stop()
})

describe('API: GET /', () => {
  let response = {}

  test('Should return 200 as status code', async () => {
    response = await axios.get(URL)
    expect(response.status).toBe(200)
  })

  test('Should be a successful operation', () => {
    expect(response.data.error).toBe(false)
  })
})

describe.skip('E2E test: Use cases from UserService', () => {})
