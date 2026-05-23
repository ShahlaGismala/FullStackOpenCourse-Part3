require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { connectToMongo } = require('./utils/mongo')
const Person = require('./models/person')

const app = express()
app.use(cors())
app.use(express.json())

// connect once
connectToMongo()

// GET all persons (from DB)
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

// POST new person — saved to DB
app.post('/api/persons', async (req, res, next) => {
  try {
    const { name, number } = req.body

    if (!name || !number) {
      return res.status(400).json({ error: 'name or number missing' })
    }

    // At this stage we ignore uniqueness checks (per exercise instructions)
    const person = new Person({ name, number })
    const savedPerson = await person.save()
    res.status(201).json(savedPerson)
  } catch (error) {
    next(error)
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
