import { getDatabase } from './database.js'

let db
let insertBillStmt
let getBillStmt
let searchBillsStmt

// Initialize prepared statements lazily
const initStatements = () => {
  if (!db) {
    db = getDatabase()
    insertBillStmt = db.prepare(`
      INSERT OR REPLACE INTO bills (
          billNumber, title, parliamentNumber, memberInCharge, 
          committee, billUrls, filePath, summarySnippet
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    getBillStmt = db.prepare('SELECT * FROM bills WHERE billNumber = ?')
    searchBillsStmt = db.prepare('SELECT * FROM bills WHERE title LIKE ?')
  }
}

/**
 * Insert multiple bills into the database
 * @param {Array} bills - Array of bill objects
 * @returns {number} Number of bills inserted
 */
export const insertBills = (bills) => {
  initStatements()

  if (!Array.isArray(bills)) {
    throw new Error('Bills must be provided as an array')
  }

  let insertedCount = 0

  // Use transaction for better performance and data consistency
  const transaction = db.transaction((billsArray) => {
    for (const bill of billsArray) {
      if (!bill.billNumber) {
        throw new Error('Each bill must have a billNumber')
      }

      insertBillStmt.run(
        bill.billNumber,
        bill.title || null,
        bill.parliamentNumber || null,
        bill.memberInCharge || null,
        bill.committee || null,
        bill.billUrls ? JSON.stringify(bill.billUrls) : null,
        bill.filePath || null,
        bill.summarySnippet || null
      )
      insertedCount++
    }
  })

  transaction(bills)
  console.log(`Successfully inserted ${insertedCount} bills into database`)
  return insertedCount
}

/**
 * Get a single bill by bill number
 * @param {string} billNumber - The bill number to search for
 * @returns {Object|null} Bill object or null if not found
 */
export const getBillByNumber = (billNumber) => {
  initStatements()

  const bill = getBillStmt.get(billNumber)

  if (bill && bill.billUrls) {
    try {
      // Parse billUrls JSON field back to object
      bill.billUrls = JSON.parse(bill.billUrls)
    } catch (parseError) {
      console.warn(
        `Error parsing billUrls JSON for bill ${billNumber}:`,
        parseError.message
      )
      bill.billUrls = null
    }
  }

  return bill
}

/**
 * Search bills by keyword in title
 * @param {string} keyword - Keyword to search for in bill titles
 * @returns {Array} Array of matching bills
 */
export const searchBillsByKeyword = (keyword) => {
  initStatements()

  const searchPattern = `%${keyword}%`
  const bills = searchBillsStmt.all(searchPattern)

  // Parse billUrls JSON field for each bill
  bills.forEach((bill) => {
    if (bill.billUrls) {
      try {
        bill.billUrls = JSON.parse(bill.billUrls)
      } catch (parseError) {
        console.warn(
          `Error parsing billUrls JSON for bill ${bill.billNumber}:`,
          parseError.message
        )
        bill.billUrls = null
      }
    }
  })

  console.log(`Search for "${keyword}" returned ${bills.length} results`)
  return bills
}
