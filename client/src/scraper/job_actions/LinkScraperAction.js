const RequestLibrary = require('request-promise')
const JobAction = require('./JobAction').AbstractJobAction

const ScrapeErrorName = 'ScrapeError'

class ScrapeError extends Error {
  constructor (message) {
    super()
    this.message = message
    this.name = ScrapeErrorName
  }

  static doThrow (e) {
    throw new ScrapeError(e.message)
  }
}

class LinkScraperAction extends JobAction {
  constructor (url) {
    super()
    this.url = url
  }

  static headers () {
    return {
      Accept: '*/*',
      'User-Agent': 'PolitisenseScraper/0.1'
    }
  }

  async perform (url) {
    this.url = (typeof url === 'undefined') ? this.url : url
    return new Promise((resolve, reject) => {
      RequestLibrary({
        uri: this.url,
        timeout: 60000,
        followAllRedirects: true,
        resolveWithFullResponse: true,
        headers: LinkScraperAction.headers()
      })
        .then((html) => {
          console.debug('Done Scraping: ' + this.url)
          resolve(html)
        })
        .catch((e) => {
          reject(new ScrapeError('could not scrape page: ' + e.message))
        })
    })
  }
}
module.exports.LinkScraper = LinkScraperAction
module.exports.ScrapeError = ScrapeError
module.exports.ScrapeErrorName = ScrapeErrorName