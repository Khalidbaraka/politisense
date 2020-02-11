require('module-alias/register')
const Utils = require('@utils')
const QueueManager = Utils.QueueManager.QueueManager
const StartAction = Utils.QueueManager.Start.StartPoliticianScrape
const StopAction = Utils.QueueManager.Stop.StopPoliticianScrape
const Throw = Utils.QueueManager.Error.ParseErrorAction

const caucusMapping = {
  unknown: 0,
  reform: 7,
  people: 24357,
  progressiveConservative: 5,
  newDemocratic: 3,
  liberal: 4,
  independentConservative: 1796,
  independentBlocQuebec: 3638,
  independentCanadianAlliance: 8,
  green: 14130,
  forceEtDemocratie: 20915,
  CooperativeCommonwealthFederation: 24046,
  conservativeIndependent: 20159,
  conservative: 8781,
  canadianAlliance: 103,
  blocQuebecois: 6
}
const provinceKeys = [
  'AB',
  'BC',
  'MB',
  'NB',
  'NL',
  'NT',
  'NS',
  'NU',
  'ON',
  'PE',
  'QC',
  'SK',
  'YT'
]

class PoliticianScraper extends QueueManager {
  static create (params, wait = 5000) {
    const manager = new PoliticianScraper(params, wait)
    manager
      .setStartAction(new StartAction(manager))
      .setStopAction(new StopAction(manager))
      .setErrorAction(new Throw(manager))
    return manager
  }

  constructor (params, wait = 5000) {
    super(wait)
    this.parliaments = []
    this.setParliaments(params.parliaments)
    this.caucuses = []
    this.setCaucuses(params.caucuses)
    this.provinces = []
    this.setProvinces(params.provinces)
    this.genders = []
    this.setGenders(params.genders)
    this.lastNamePrefixes = []
    this.setLastNamePrefixes(params.lastNamePrefixes)
    this.params = []
    this.createQueries(params.url)
    this.queryCount = this.params.length
    this.maxQueryCount = this.queryCount
  }

  async run () {
    await super.run()
    this.finish()
  }

  accumulate (result) {
    this.result.push(result)
    return result
  }

  finish () {
    console.log(`INFO: Data found for ${this.queryCount}/${this.maxQueryCount} queries from passed params`)
  }

  setParliaments (parliaments) {
    if (typeof parliaments === 'undefined' ||
       (typeof parliaments === typeof ' ' && parliaments.toLowerCase().includes('all'))) {
      this.parliaments.push('all')
    } else if (typeof parliaments === typeof []) {
      this.parliaments = parliaments.filter(parliament => {
        return parliament >= 35
      })
    }
  }

  setCaucuses (caucuses) {
    if (typeof caucuses === 'undefined' ||
       (typeof caucuses === typeof ' ' && caucuses.toLowerCase().includes('all'))) {
      this.caucuses.push('all')
    } else if (typeof caucuses === typeof []) {
      const validPartyKeys = Object.values(caucusMapping)
      this.caucuses = caucuses.filter(caucus => {
        return validPartyKeys.includes(caucus)
      })
    }
  }

  setProvinces (provinces) {
    if (typeof provinces === 'undefined' ||
       (typeof provinces === typeof ' ' && provinces.toLowerCase().includes('all'))) {
      this.provinces.push('all')
    } else if (typeof provinces === typeof []) {
      this.provinces = provinces.filter(province => {
        return provinceKeys.includes(province)
      })
    }
  }

  setGenders (genders) {
    if (typeof genders === 'undefined' ||
       (typeof genders === typeof ' ' && genders.toLowerCase().includes('all'))) {
      this.genders.push('all')
    } else if (typeof genders === typeof []) {
      this.genders = genders.filter(gender => {
        return gender.toLowerCase() === 'm' || gender.toLowerCase() === 'f'
      })
      this.genders = this.genders.map(g => {
        return g.toUpperCase()
      })
    }
  }

  setLastNamePrefixes (lastNamePrefixes) {
    if (typeof lastNamePrefixes === 'undefined' ||
       (typeof lastNamePrefixes === typeof ' ' && lastNamePrefixes.toLowerCase().includes('all'))) {
      this.lastNamePrefixes.push('')
    } else if (typeof lastNamePrefixes === typeof []) {
      this.lastNamePrefixes = lastNamePrefixes.filter(prefix => {
        return prefix.length === 1 && prefix.toLowerCase().match(/[a-z]/i)
      })
      this.lastNamePrefixes = this.lastNamePrefixes.forEach(prefix => {
        return prefix.toUpperCase()
      })
    }
  }

  createQueries (url) {
    this.parliaments.forEach(parliament => {
      this.caucuses.forEach(caucus => {
        this.provinces.forEach(province => {
          this.genders.forEach(gender => {
            this.lastNamePrefixes.forEach(prefix => {
              this.params.push({
                url: url,
                params: {
                  parliament: parliament,
                  caucusId: caucus,
                  province: province,
                  gender: gender,
                  lastname: prefix
                }
              })
            })
          })
        })
      })
    })
  }
}

module.exports.PoliticianScraper = PoliticianScraper

PoliticianScraper.create({
  url: 'https://www.ourcommons.ca/Members/en/search/xml',
  parliaments: 'all'
})
  .execute()
  .then(result => {
    console.log(result)
  })