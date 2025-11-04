import express from 'express'
import cors from 'cors'
import { initializeDatabase } from './controllers/database.js'
import billsRouter from './routes/bills.js'

// Create Express app
const app = express()
const PORT = 4000

// Middleware setup
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Initialize database on startup
try {
  initializeDatabase()
  console.log('Database initialized successfully')
} catch (error) {
  console.error('Failed to initialize database:', error.message)
  process.exit(1)
}

// Routes
app.use('/api/bills', billsRouter)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: 'connected',
  })
})

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...')
  process.exit(0)
})

// Start server
app.listen(PORT, () => {
  console.log(`Bills DB Server is running on port ${PORT}`)
  console.log(`Health check available at: http://localhost:${PORT}/api/health`)
  console.log('Available endpoints:')
  console.log(`  POST http://localhost:${PORT}/api/bills`)
  console.log(`  GET  http://localhost:${PORT}/api/bills/:billNumber`)
  console.log(`  GET  http://localhost:${PORT}/api/bills/search/:keyword`)
})
