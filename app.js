const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { TOKEN_KEY, verifyToken } = require('./src/modules/token')

const app = express()
app.use(express.json())
app.use(cors())

let db = [
  {
    id: 1,
    name: 'Store 1',
    items: [
      {
        id: 1,
        name: 'Item 1',
        price: 10,
        store_id: 1,
      },
      {
        id: 2,
        name: 'Item 2',
        price: 20,
        store_id: 1,
      },
    ],
  },
  {
    id: 2,
    name: 'Store 2',
    items: [
      {
        id: 1,
        name: 'Item 1',
        price: 10,
        store_id: 1,
      },
      {
        id: 2,
        name: 'Item 2',
        price: 20,
        store_id: 1,
      },
    ],
  },
  {
    id: 3,
    name: 'Store 3',
    items: [
      {
        id: 1,
        name: 'Item 1',
        price: 10,
        store_id: 1,
      },
      {
        id: 2,
        name: 'Item 2',
        price: 20,
        store_id: 1,
      },
    ],
  },
]

// Endpoints
app.post('/register', (req, res) => {
  //Register
  const username = req.body.username
  const password = req.body.password

  if (username && password) {
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
      id: 1,
      name: 'Administrator',
      email: 'admin@mail.com',
      password: 'admin',
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
  const filteredStore = db.find(store => store.name === name)
  if (filteredStore) {
    res.status(200).json(filteredStore)
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
  res.status(200).json(data)
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
  // find item in store in all db
  const itemIndex = db[storeIndex].items.findIndex(item => item.name === name)
  if (itemIndex !== -1)
    return res.status(500).send({
      message: 'Item already exists',
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

app.get('/item/:name', verifyToken, (req, res) => {
  // Get item from a store
  const name = req.params.name
  const itemIndex = db.findIndex(store => store.items.find(item => item.name === name))
  if (itemIndex === -1) return res.status(500).send({ message: 'Item not found' })

  const item = db[itemIndex].items.find(item => item.name === name)
  res.status(200).json(item)
})

app.put('/item/:name', (req, res) => {
  // Update item in a store
  const name = req.params.name
  const price = req.body.price
  const store_id = req.body.store_id

  const storeIndex = db.findIndex(store => store.id === store_id)
  if (storeIndex === -1)
    return res.status(500).send({
      message: 'Store not found',
    })
  // find item in store in all db
  const itemIndex = db[storeIndex].items.findIndex(item => item.name === name)
  if (itemIndex === -1)
    return res.status(500).send({
      message: 'Item not found',
    })
  // update item in store
  db[storeIndex].items[itemIndex] = {
    id: db[storeIndex].items[itemIndex].id,
    name,
    price,
    store_id,
  }

  res.status(200).json(db[storeIndex].items[itemIndex])
})

app.delete('/item/:name', (req, res) => {
  // FIX: A este endpoint hay que pasarle un store_id para saber de cual tienda hay que eliminarlo
  // Delete item from a store
  const name = req.params.name
  const itemIndex = db.findIndex(store => store.items.find(item => item.name === name))
  if (itemIndex === -1)
    return res.status(500).send({
      message: 'Item not found',
    })
  db[itemIndex].items.splice(itemIndex, 1)
  res.status(200).send({
    message: 'Item deleted',
  })
})

app.get('/items', (req, res) => {
  // Get all items of db
  const data = []
  db.forEach(store => {
    store.items.forEach(item => data.push(item))
  })
  res.status(200).json({
    items: data,
  })
})

app.delete('/store/:name', (req, res) => {
  // Delete a store
  const name = req.params.name
  const filteredStores = db.filter(store => store.name !== name)

  if (!filteredStores) {
    return res.status(400).send({
      message: 'Stores not found',
    })
  } else {
    res.status(200).send({
      message: 'Store deleted',
    })
  }
  db = filteredStores
})

app.listen(3001, () => {
  console.log('Server is running on port 3001')
})
