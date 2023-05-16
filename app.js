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
  if (token == null) return res.status(401).send('Token Required')
  jwt.verify(token, TOKEN_KEY, (err, user) => {
    if (err) return res.status(403).send('Token invalidate')
    req.user = user
    next()
  })
}

let db = []

// Endpoints
app.post('/register', (req, res) => {
  //Register
  const username = req.body.username
  const password = req.body.password

  if (username === 'admin' && password === 'admin') {
    const response = {
      message: 'User created sucesfully',
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

app.post('/store/:storeName', (req, res) => {
  // Create new store
  const storeName = req.params.storeName
  const findStore = db.some(store => store.name === storeName)
  if (findStore)
    return res.status(500).send({
      message: 'Store already exists',
    })
  const response = {
    id: db.length + 1,
    name: storeName,
    item: [],
  }
  db.push(response)
  res.status(200).json(response)
})

app.delete('/store/:storeName', (req, res) => {
  // Delete a store
  const storeName = req.params.storeName
  db = db.filter(store => store.name !== storeName)
  const response = {
    message: 'Store deleted',
  }
  res.status(200).send(response)
})

app.get('/store/:storeName', (req, res) => {
  // Get a store
  const storeName = req.params.storeName
  const response = db.find(store => store.name === storeName)
  res.status(200).json(response)
})

app.get('/stores', verifyToken, (req, res) => {
  const datos = {
    stores: db,
  }
  res.status(200).json(datos)
})

app.listen(3001, () => {
  console.log('Server is running on port 3001')
})
