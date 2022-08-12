const express = require('express')
const morgan = require('morgan')

const { userRouter } = require('./routes')

const app = express()
const PORT = process.env.PORT

// Articles: price, image, description, name
// Users: name, email, Articles[]

app.use(express.json())
app.use(morgan('dev'))
app.use(userRouter)

const fooMiddleware = (req, res, next) => {
  req.foo = 'bar'
  next()
}

app.get(
  '/',
  fooMiddleware,
  (req, res) => {
    console.log('req.foo', req.foo)
    res.send({
      message: 'Hola mundo desde Express!',
      method: 'GET',
      foo: req.foo
    })
  }
)

app.post(
  '/',
  (req, res) => {
    console.log('req.foo', req.foo)
    res.send({
      message: 'Hola mundo desde Express!',
      method: 'POST',
      foo: req.foo
    })
  }
)

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`)
})
