require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { connectToMongo } = require('./utils/mongo')
const Person = require('./models/person')

const errorHandler = require('./middleware/errorHandler')
const unknownEndpoint = require('./middleware/unknownEndpoint')

const app = express()
app.use(cors())
app.use(express.json())

// Connect to MongoDB
connectToMongo()

// Routes
app.get('/api/persons', async (req, res, next) => {
  try {
    const persons = await Person.find({})
    res.json(persons)
  } catch (error) {
    next(error)
  }
})

app.get('/api/persons/:id', async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id)
    if (person) res.json(person)
    else res.status(404).end()
  } catch (error) {
    next(error)
  }
})

app.post('/api/persons', async (req, res, next) => {
  try {
    const { name, number } = req.body
    if (!name || !number) {
      return res.status(400).json({ error: 'name or number missing' })
    }

    const person = new Person({ name, number })
    const savedPerson = await person.save()
    res.status(201).json(savedPerson)
  } catch (error) {
    next(error)
  }
})

app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    await Person.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

// Unknown endpoint middleware should be registered before the error handler
app.use(unknownEndpoint)

// Error handler middleware
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
