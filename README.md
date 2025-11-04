# Bills DB Server

A modular REST API server for managing bill metadata using Express.js and SQLite.

## Project Structure

```
bills-db-server/
├── index.js                 # Server entry point
├── routes/
│   └── bills.js            # API routes for /api/bills
├── controllers/
│   ├── database.js         # Database initialization
│   └── billsController.js  # Database operations
├── models/
│   └── Bill.js             # Bill model class (optional)
├── db/
│   └── bills.db            # SQLite database (auto-created)
└── package.json
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

The server will start on port 4000 and automatically create the database and tables.

## API Endpoints

- `POST /api/bills` - Insert array of bills
- `GET /api/bills/:billNumber` - Get bill by number
- `GET /api/bills/search/:keyword` - Search bills by title keyword
- `GET /api/health` - Health check

## Database Schema

The `bills` table contains:

- billNumber (TEXT PRIMARY KEY)
- title (TEXT)
- parliamentNumber (TEXT)
- memberInCharge (TEXT)
- committee (TEXT)
- billUrls (JSON)
- filePath (TEXT)
- summarySnippet (TEXT)

Indexes on: title, memberInCharge

## Example Usage

```bash
# Insert bills
curl -X POST http://localhost:4000/api/bills \
  -H "Content-Type: application/json" \
  -d '[{"billNumber": "B1-2023", "title": "Sample Bill", "billUrls": ["http://example.com"]}]'

# Get a bill
curl http://localhost:4000/api/bills/B1-2023

# Search bills
curl http://localhost:4000/api/bills/search/sample
```
