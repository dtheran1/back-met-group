const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())
app.use(cors())

const TOKEN_KEY = 'x4TDI23nkifaASDOJOASLasd5y'

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)
  jwt.verify(token, TOKEN_KEY, (err, user) => {
    if (err) return res.sendStatus(403).send('Token invalidate')
    req.user = user
    next()
  })
}

// Endpoints
app.post('/register', (req, res) => {
  //Register
  const username = req.body.username
  const password = req.body.password

  if (username === 'admin' && password === 'admin') {
    const response = {
      messaje: 'User created sucesfully',
    }
    res.status(200).json(response)
  } else {
    res.status(400).send('User no found')
  }
})

app.post('/auth', (req, res) => {
  // Login
  const username = req.body.username
  const password = req.body.password
  if (username === 'admin' && password === 'admin') {
    const data = {
      id: 333,
      name: 'Daniel Theran',
      email: 'd@mail.com',
      password: '12345',
    }
    const token = jwt.sign(
      {
        userId: data.id,
        email: data.email,
      },
      TOKEN_KEY,
      {
        expiresIn: '2h',
      }
    )
    let auxData = { token }
    res.status(200).json(auxData)
  } else {
    res.status(400).send('User no found')
  }
})

app.post('/store/:storename', (req, res) => {
  // Create new store
  const storename = req.params.storename
  const response = {
    id: 2,
    name: storename,
    item: [],
  }
  res.status(200).json(response)
})

app.get('/store/:storename', (req, res) => {
  // Get a store
  const storename = req.params.storename
  const response = {
    id: 2,
    name: storename,
    item: [],
  }
  res.status(200).json(response)
})

app.get('/user/:id/store', (req, res) => {
  const datos = [
    {
      id: 1,
      store: 'DanyCompany',
      total: 200,
      date: '2023-05-13',
    },
    {
      id: 2,
      store: 'example',
      total: 10,
      date: '2023-05-13',
    },
    {
      id: 3,
      store: 'ebeCompany',
      total: 10,
      date: '2023-05-13',
    },
  ]
  res.status(200).json(datos)
})

app.listen(3001, () => {
  console.log('Server is running on port 3001')
})
