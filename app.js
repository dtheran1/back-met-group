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
    res.status(400).send('Opps! something went wrong, try again.')
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
    res.status(400).send({
      message: 'User no found.',
    })
  }
})

app.post('/store/:name', (req, res) => {
  // Create new store
  const name = req.params.name
  const findStore = db.some(store => store.name === name)
  if (findStore)
    // Validamos que no existan mas de una tienda con el mismo nombre
    return res.status(500).send({
      message: 'Store already exists',
    })
  const newStore = {
    id: db.length + 1,
    name: name,
    items: [],
  }
  db.push(newStore)
  res.status(200).json(newStore)
})

app.get('/store/:name', (req, res) => {
  // Get a store
  const name = req.params.name
  const response = db.find(store => store.name === name)
  if (response) {
    res.status(200).json(response)
  } else {
    res.status(404).send({
      message: 'Store not found',
    })
  }
})

app.get('/stores', verifyToken, (req, res) => {
  const data = {
    stores: db,
  }
  if (db.length) {
    res.status(200).json(data)
  } else {
    res.status(404).send({
      message: 'Stores not found',
    })
  }
})

app.post('/item/:name', (req, res) => {
  // Add item to a store
  const name = req.params.name
  const price = req.body.price
  const store_id = req.body.store_id

  const storeIndex = db.findIndex(store => store.id === store_id)
  if (storeIndex === -1)
    return res.status(500).send({
      message: 'Store not found',
    })
  const newItem = {
    id: db[storeIndex].items.length + 1,
    name,
    price,
    store_id,
  }
  db[storeIndex].items.push(newItem)
  res.status(200).json(newItem)
})

app.delete('/store/:name', (req, res) => {
  // Delete a store
  const name = req.params.name
  const storeInd = db.findIndex(store => store.name === name)
  if (storeInd === -1)
    return res.status(500).send({
      message: 'Store not found',
    })
  db.splice(storeInd, 1)
  res.status(200).send({
    message: 'Store deleted',
  })
})

app.listen(3001, () => {
  console.log('Server is running on port 3001')
})
