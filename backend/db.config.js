const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient({
    log: ['error']
})

db.$connect() // Ensures a connection to the database is made
  .then(() => console.log("Connected to the database successfully"))
  .catch((err) => console.error("Error connecting to the database:", err))

module.exports = {
    db
}