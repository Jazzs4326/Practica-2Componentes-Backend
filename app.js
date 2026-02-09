const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
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

app.use((req, res) => {
  res.status(404).send('Error 404: Endpoint no encontrado')
})

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`)
})
