const express = require('express')
const { v4: uuidv4 } = require('uuid')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { TOKEN_KEY, verifyToken } = require('./src/modules/token')

const app = express()
app.use(express.json())
app.use(cors())

let db = []

let registeredUsers = []

// Endpoints
app.post('/register', (req, res) => {
  // Register
  try {
    const { username, password } = req.body

    // Validamos que no existan mas de un user con el mismo nombre
    const userExists = registeredUsers.some(user => user.username === username)
    if (userExists) {
      return res.status(409).json({ message: 'User already exists' })
    }

    if (username && password) {
      registeredUsers.push({
        username,
        password,
      })
      const response = {
        message: 'User created successfully',
      }
      res.status(201).json(response)
    } else {
      res.status(422).json({ message: 'Invalid or missing fields' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/auth', (req, res) => {
  // Login
  const { username, password } = req.body

  const user = registeredUsers.find(
    user => user.username === username && user.password === password
  )

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password.' })
  }

  if (user) {
    const { username } = user
    try {
      const token = jwt.sign(
        {
          username,
        },
        TOKEN_KEY,
        {
          expiresIn: '2h',
        }
      )
      return res.status(200).json({ token })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
})

app.post('/store/:name', (req, res) => {
  // Create new store
  try {
    const { name } = req.params
    // Validamos que no existan mas de una tienda con el mismo nombre
    const isStoreExists = db.some(store => store.name === name)

    if (isStoreExists) {
      return res.status(409).json({
        message: 'Store already exists',
      })
    }

    const newStore = {
      id: uuidv4(),
      name,
      items: [],
    }

    db.push(newStore)

    return res.status(201).json(newStore)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/store/:name', (req, res) => {
  // Get a store
  try {
    const { name } = req.params
    const filteredStore = db.find(store => store.name === name)
    filteredStore
      ? res.status(200).json(filteredStore)
      : res.status(404).send({ message: 'Store not found' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/store/:name', async (req, res) => {
  // Delete a store
  const { name } = req.params
  try {
    const storeToRemove = db.find(store => store.name === name)
    // If store not found, return 404 error
    if (!storeToRemove) return res.status(404).send({ message: 'Store not found' })

    db = db.filter(store => store.name !== name)
    res.status(200).send({ message: 'Store deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/stores', verifyToken, (req, res) => {
  try {
    const data = {
      stores: db,
    }
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/item/:name', (req, res) => {
  // Add item to a store
  try {
    const { name } = req.params
    const { price, store_id } = req.body
    const storeIndex = db.findIndex(store => store.id === store_id)

    if (storeIndex === -1) {
      return res.status(404).json({ error: 'Store not found' })
    }
    // find item in store in all db
    const foundItem = db.some(store => store.items.some(item => item.name === name))
    if (foundItem) {
      return res.status(409).json({ error: 'Item already exists' })
    }

    const newItem = {
      id: uuidv4(),
      name,
      price,
      store_id,
    }

    db[storeIndex].items.push(newItem)
    res.status(201).json(newItem)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/item/:name', verifyToken, (req, res) => {
  // Get item from a store
  try {
    const { name } = req.params
    const item = db
      .find(store => store.items.find(item => item.name === name))
      ?.items.find(item => item.name === name)
    if (!item) return res.status(404).json({ message: 'Item not found' })
    res.status(200).json(item)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/item/:name', (req, res) => {
  // Update item in a store
  try {
    const { name } = req.params
    const { price, store_id } = req.body

    // find store in db
    const store = db.find(store => store.id === store_id)
    if (!store) {
      return res.status(404).json({ error: 'Store not found' })
    }
    // find item in store in store
    const item = store.items.find(item => item.name === name)
    if (!item) {
      return res.status(404).json({ error: 'Item not found' })
    }

    // update item
    item.price = price
    return res.status(200).json(item)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/item/:name', (req, res) => {
  // Delete item from a store
  try {
    const { name } = req.params
    const storeIndexWhitItem = db.findIndex(store =>
      store.items.some(item => item.name === name)
    )

    if (storeIndexWhitItem === -1) {
      return res
        .status(404)
        .json({ error: `The item "${name}" could not be found in any stores.` })
    }

    const store = db[storeIndexWhitItem]
    store.items = store.items.filter(item => item.name !== name)
    res.status(204).send({ message: 'Item deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/items', (req, res) => {
  // Get all items of db
  try {
    // implementamos flatmap para aplanar los arrays anidados y devolver un solo array de ellos
    const data = db.flatMap(store => store.items)
    res.status(200).json({
      items: data,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(3001, () => {
  console.log('Server is running on port 3001')
})
