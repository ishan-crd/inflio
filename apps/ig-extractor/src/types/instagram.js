/**
 * @typedef {Object} ReelAnalytics
 * @property {string} mediaId
 * @property {string} shortcode
 * @property {string} caption
 * @property {string} coverUrl
 * @property {number} timestamp - Unix timestamp
 * @property {number} duration - seconds
 * @property {number} plays
 * @property {number} likes
 * @property {number} comments
 * @property {number} shares
 * @property {number} saves
 * @property {number} reach
 * @property {number} impressions
 * @property {number} [profileVisits]
 * @property {number} [follows]
 * @property {Array<{source: string, value: number}>} [trafficSources]
 * @property {Array<{key: string, percentage: number}>} [gender]
 * @property {Array<{range: string, percentage: number}>} [age]
 * @property {Array<{name: string, percentage: number}>} [locations]
 */

/**
 * @typedef {Object} ProfileData
 * @property {string} username
 * @property {string} fullName
 * @property {string} bio
 * @property {string} profilePicUrl
 * @property {number} followers
 * @property {number} following
 * @property {number} posts
 * @property {boolean} isVerified
 * @property {boolean} isBusinessAccount
 * @property {string} [category]
 * @property {string} [externalUrl]
 */

/**
 * @typedef {Object} AccountInsights
 * @property {number} [accountsReached7d]
 * @property {number} [accountsReached30d]
 * @property {number} [accountsEngaged7d]
 * @property {number} [accountsEngaged30d]
 * @property {number} [totalFollowers]
 * @property {number} [followerGrowth7d]
 * @property {Array<{key: string, percentage: number}>} [followerGender]
 * @property {Array<{range: string, percentage: number}>} [followerAge]
 * @property {Array<{city: string, percentage: number}>} [followerTopCities]
 * @property {Array<{country: string, percentage: number}>} [followerTopCountries]
 */

/**
 * @typedef {Object} ExtractionResult
 * @property {ProfileData} profile
 * @property {ReelAnalytics[]} reels
 * @property {AccountInsights} accountInsights
 * @property {string} extractedAt - ISO timestamp
 * @property {number} apiRequestsCaptured
 * @property {string[]} apiEndpoints
 */
