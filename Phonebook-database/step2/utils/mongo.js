require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

const connectToMongo = async () => {
  try {
    await mongoose.connect(url)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message)
  }
}

module.exports = {
  connectToMongo,
  mongoose
}
