require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { connectToMongo } = require('./utils/mongo')
const Person = require('./models/person')

const unknownEndpoint = require('./middleware/unknownEndpoint')
const errorHandler = require('./middleware/errorHandler')

const app = express()
app.use(cors())
app.use(express.json())

// Connect to MongoDB
connectToMongo()

// GET all persons
app.get('/api/persons', async (req, res, next) => {
  try {
    const persons = await Person.find({})
    res.json(persons)
  } catch (error) {
    next(error)
  }
})

// GET single person
app.get('/api/persons/:id', async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id)
    if (person) res.json(person)
    else res.status(404).end()
  } catch (error) {
    next(error)
  }
})

// POST new person
app.post('/api/persons', async (req, res, next) => {
  try {
    const { name, number } = req.body
    if (!name || !number) {
      return res.status(400).json({ error: 'name or number missing' })
    }

    // Per exercise step 2 ignore uniqueness checks here
    const person = new Person({ name, number })
    const savedPerson = await person.save()
    res.status(201).json(savedPerson)
  } catch (error) {
    next(error)
  }
})

// DELETE person
app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    await Person.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

// PUT update person
app.put('/api/persons/:id', async (req, res, next) => {
  try {
    const { name, number } = req.body

    const update = {}
    if (name !== undefined) update.name = name
    if (number !== undefined) update.number = number

    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true, context: 'query' }
    )

    if (updatedPerson) {
      res.json(updatedPerson)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

// Unknown endpoint middleware
app.use(unknownEndpoint)

// Error handler middleware
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
