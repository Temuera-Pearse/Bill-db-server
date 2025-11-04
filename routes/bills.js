import express from 'express'
import {
  insertBills,
  getBillByNumber,
  searchBillsByKeyword,
} from '../controllers/billsController.js'

const router = express.Router()

/**
 * POST /api/bills - Insert array of bills
 */
router.post('/', (req, res) => {
  try {
    const bills = req.body

    if (!Array.isArray(bills)) {
      return res.status(400).json({
        error: 'Request body must be an array of bills',
      })
    }

    if (bills.length === 0) {
      return res.status(400).json({
        error: 'Bills array cannot be empty',
      })
    }

    const insertedCount = insertBills(bills)

    res.status(201).json({
      message: `Successfully inserted ${insertedCount} bills`,
      count: insertedCount,
    })
  } catch (error) {
    console.error('Error inserting bills:', error.message)
    res.status(500).json({
      error: 'Failed to insert bills',
      details: error.message,
    })
  }
})

/**
 * GET /api/bills/:billNumber - Get bill by number
 */
router.get('/:billNumber', (req, res) => {
  try {
    const { billNumber } = req.params
    const bill = getBillByNumber(billNumber)

    if (!bill) {
      return res.status(404).json({
        error: `Bill with number "${billNumber}" not found`,
      })
    }

    res.json(bill)
  } catch (error) {
    console.error('Error fetching bill:', error.message)
    res.status(500).json({
      error: 'Failed to fetch bill',
      details: error.message,
    })
  }
})

/**
 * GET /api/bills/search/:keyword - Search bills by title keyword
 */
router.get('/search/:keyword', (req, res) => {
  try {
    const { keyword } = req.params

    if (!keyword || keyword.trim().length === 0) {
      return res.status(400).json({
        error: 'Search keyword cannot be empty',
      })
    }

    const bills = searchBillsByKeyword(keyword.trim())

    res.json({
      keyword: keyword.trim(),
      count: bills.length,
      bills: bills,
    })
  } catch (error) {
    console.error('Error searching bills:', error.message)
    res.status(500).json({
      error: 'Failed to search bills',
      details: error.message,
    })
  }
})

export default router
