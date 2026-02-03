const express = require('express')
const app = express()
const port = 3002

app.get('/', (req, res) => {
  const { name, lastName } = req.query

  res.send(`Hola ${name} ${lastName}`)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
