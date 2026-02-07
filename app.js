const express = require('express')
const fs = require('fs')
const app = express()
const port = 3002

app.use(express.json())

const getUsers = () => {
  return JSON.parse(fs.readFileSync('users.json', 'utf8'))
}

const saveUsers = (users) => {
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2))
}

app.get('/users', (req, res) => {
  const users = getUsers()
  res.json(users)
})

app.get('/users/:id', (req, res) => {
  const users = getUsers()
  const id = Number(req.params.id)

  const user = users.find(u => u.id === id)

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' })
  }

  res.json(user)
})

app.post('/users', (req, res) => {
  const users = getUsers()
  users.push(req.body)
  saveUsers(users)

  res.json({ message: 'Usuario agregado' })
})

app.put('/users/:id', (req, res) => {
  const users = getUsers()
  const id = Number(req.params.id)

  const index = users.findIndex(u => u.id === id)

  if (index === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' })
  }

  users[index] = {
    ...users[index],
    ...req.body
  }
  saveUsers(users)

  res.json({ message: 'Usuario actualizado' })

})

app.delete('/users/:id', (req, res) => {
  const users = getUsers()
  const id = Number(req.params.id)

  const index = users.findIndex(u => u.id === id)

  if (index === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' })
  }

  users.splice(index, 1)
  saveUsers(users)

  res.json({ message: 'Usuario eliminado' })
})

app.use((req, res) => {
  res.status(404).send('Error 404: Endpoint no encontrado')
})

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`)
})
