import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { mkdirSync, existsSync } from 'fs'

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Database configuration
const dbDir = join(__dirname, '..', 'db')
const dbPath = join(dbDir, 'bills.db')

// Ensure database directory exists
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true })
  console.log('Created database directory:', dbDir)
}

// Initialize SQLite database connection
const db = new Database(dbPath)
console.log('Connected to SQLite database:', dbPath)

/**
 * Initialize database schema - creates tables and indexes if they don't exist
 */
export const initializeDatabase = () => {
  try {
    // Create bills table with all required columns
    db.exec(`
            CREATE TABLE IF NOT EXISTS bills (
                billNumber TEXT PRIMARY KEY,
                title TEXT,
                parliamentNumber TEXT,
                memberInCharge TEXT,
                committee TEXT,
                billUrls JSON,
                filePath TEXT,
                summarySnippet TEXT
            )
        `)

    // Create indexes for fast search on title and memberInCharge
    db.exec(`
            CREATE INDEX IF NOT EXISTS idx_bills_title ON bills(title);
            CREATE INDEX IF NOT EXISTS idx_bills_member_in_charge ON bills(memberInCharge);
        `)

    console.log('Database schema initialized with bills table and indexes')
  } catch (error) {
    console.error('Error initializing database schema:', error.message)
    throw error
  }
}

/**
 * Get database instance for use in other modules
 */
export const getDatabase = () => db

/**
 * Close database connection gracefully
 */
export const closeDatabase = () => {
  db.close()
  console.log('Database connection closed')
}
