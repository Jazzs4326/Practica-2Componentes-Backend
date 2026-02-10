const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
const { v4: uuidv4 } = require('uuid')
const app = express()
const port = 3002

app.use(express.json())

const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)
const dbName = 'practica'

async function connectDB() {
  await client.connect()
  console.log('Conectado a MongoDB')
  return client.db(dbName)
}

//Users
app.get('/users', async (req, res) => {
  const db = await connectDB()
  const users = await db.collection('users').find().toArray()
  res.json(users)
})

app.get('/users/:id', async (req, res) => {
  const db = await connectDB()
  const id = req.params.id

  const user = await db.collection('users').findOne({ _id: new ObjectId(id) })

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' })
  }

  res.json(user)
})

app.post('/users', async (req, res) => {
  const db = await connectDB()
  await db.collection('users').insertOne(req.body)

  res.json({ message: 'Usuario agregado' })
})

app.put('/users/:id', async (req, res) => {
  const db = await connectDB()
  const id = req.params.id

  const result = await db.collection('users').updateOne(
    { _id: new ObjectId(id) },
    { $set: req.body }
  )

  if (result.matchedCount === 0) {
    return res.status(404).json({ error: 'Usuario no encontrado' })
  }

  res.json({ message: 'Usuario actualizado' })
})

app.delete('/users/:id', async (req, res) => {
  const db = await connectDB()
  const id = req.params.id

  const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) })

  if (result.deletedCount === 0) {
    return res.status(404).json({ error: 'Usuario no encontrado' })
  }

  res.json({ message: 'Usuario eliminado' })
})

//Products
app.get('/products', async (req, res) => {
  const db = await connectDB()
  const products = await db.collection('products').find().toArray()
  res.json(products)
})

app.get('/products/:id', async (req, res) => {
  const db = await connectDB()
  const product = await db.collection('products').findOne({ id: req.params.id })

  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' })
  }

  res.json(product)
})

app.post('/products', async (req, res) => {
  const db = await connectDB()

  const product = {
    id: uuidv4(),
    name: req.body.name,
    price: Number(req.body.price),
    description: req.body.description,
    imgUrl: req.body.imgUrl,
    category: req.body.category,
    options: req.body.options
  }

  await db.collection('products').insertOne(product)
  res.json({ message: 'Producto agregado', product })
})

app.put('/products/:id', async (req, res) => {
  const db = await connectDB()
  const id = req.params.id

  const result = await db.collection('products').updateOne(
    { id: id },
    { $set: req.body }
  )

  if (result.matchedCount === 0) {
    return res.status(404).json({ error: 'Producto no encontrado' })
  }

  res.json({ message: 'Producto actualizado' })
})

app.delete('/products/:id', async (req, res) => {
  const db = await connectDB()
  const id = req.params.id

  const result = await db.collection('products').deleteOne({ id: id })

  if (result.deletedCount === 0) {
    return res.status(404).json({ error: 'Producto no encontrado' })
  }

  res.json({ message: 'Producto eliminado' })
})



//Shopping 
app.get('/shopping', async (req, res) => {
  const db = await connectDB()
  const shopping = await db.collection('shopping').find().toArray()
  res.json(shopping)
})

app.get('/shopping/:id', async (req, res) => {
  const db = await connectDB()
  const id = req.params.id

  const purchase = await db.collection('shopping').findOne({ id: id })

  if (!purchase) {
    return res.status(404).json({ error: 'Compra no encontrada' })
  }

  res.json(purchase)
})

app.post('/shopping', async (req, res) => {
  const db = await connectDB()

  const shopping = {
    id: uuidv4(),
    UserID: new ObjectId(req.body.UserID),
    Products: req.body.Products,
    Date: new Date().toISOString().split('T')[0]
  }

  await db.collection('shopping').insertOne(shopping)
  res.json({ message: 'Compra registrada', shopping })
})

app.delete('/shopping/:id', async (req, res) => {
  const db = await connectDB()
  const id = req.params.id

  const result = await db.collection('shopping').deleteOne({ id: id })

  if (result.deletedCount === 0) {
    return res.status(404).json({ error: 'Compra no encontrada' })
  }

  res.json({ message: 'Compra eliminada' })
})

app.use((req, res) => {
  res.status(404).send('Error 404: Endpoint no encontrado')
})

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`)
})
