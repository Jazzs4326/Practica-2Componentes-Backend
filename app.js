const express = require('express')
const app = express()
const port = 3002
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/users', (req, res) => {
  const { name, lastname } = req.query
  res.send(`Holaaaaaa ${name} ${lastname}`)
})

app.post('/users', (req, res) => {
  console.log(req)
  res.json(req.body)
})

app.put('/users', (req, res) => {
  res.send('Got a PUT request at /user')
})

app.delete('/users', (req, res) => {
  res.send('Got a DELETE request at /user')
})

app.use((req, res) => {
  res.status(404).send('Error 404: Endpoint no encontrado')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})