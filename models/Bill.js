/**
 * Bill model class representing the structure of a bill record
 */
export class Bill {
  constructor({
    billNumber,
    title = null,
    parliamentNumber = null,
    memberInCharge = null,
    committee = null,
    billUrls = null,
    filePath = null,
    summarySnippet = null,
  }) {
    this.billNumber = billNumber
    this.title = title
    this.parliamentNumber = parliamentNumber
    this.memberInCharge = memberInCharge
    this.committee = committee
    this.billUrls = billUrls
    this.filePath = filePath
    this.summarySnippet = summarySnippet
  }

  /**
   * Validate that the bill has required fields
   * @returns {boolean} True if valid, throws error if invalid
   */
  validate() {
    if (!this.billNumber || typeof this.billNumber !== 'string') {
      throw new Error('billNumber is required and must be a string')
    }
    return true
  }

  /**
   * Convert bill to database-ready format
   * @returns {Object} Object ready for database insertion
   */
  toDbFormat() {
    return {
      billNumber: this.billNumber,
      title: this.title,
      parliamentNumber: this.parliamentNumber,
      memberInCharge: this.memberInCharge,
      committee: this.committee,
      billUrls: this.billUrls ? JSON.stringify(this.billUrls) : null,
      filePath: this.filePath,
      summarySnippet: this.summarySnippet,
    }
  }
}
