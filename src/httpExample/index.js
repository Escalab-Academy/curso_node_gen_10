const http = require('http')
const PORT = process.env.PORT

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.writeHead(200)

  return res.end(
    JSON.stringify({
      message: `You have used ${req.method} method`,
      url: req.url
    })
  )
})

server.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`)
})
