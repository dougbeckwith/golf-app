const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const cors = require('cors')
const port = 3001
const clubRoutes = require('./routes/clubRoutes')
const path = require('path')

const connectDataBase = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}`)
    console.log('Connected to database')
  } catch (err) {
    console.log(err)
  }
}
connectDataBase()

app.use(express.json())
app.use('/api/clubs', clubRoutes)
// PORT only defined in production server

app.use(express.static(path.join(__dirname, '/client/build')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build', 'index.html'))
})

app.listen(process.env.PORT || port, () => {
  if (process.env.PORT) {
    console.log(`Server listening ${process.env.PORT}`)
  } else {
    console.log(`Server listening ${port}`)
  }
})
