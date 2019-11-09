import { XmlDataParser } from './XmlDataParser'
import { ScrapeRunner } from '../../scraper/ScrapeRunner'
import { VoteParticipantsXmlParser } from './VoteParticipantsXmlParser'

class VoteXmlParser extends XmlDataParser {
  static getVoteParticipantsUrl (voteId) {
    return `https://www.ourcommons.ca/Parliamentarians/en/votes/42/1/${voteId}/`
  }

  constructor (xml, currentParliament = undefined) {
    super(xml)
    this.currentParliament = currentParliament
  }

  get TAG_NAME () {
    return 'VoteParticipant'
  }

  get LIST_TAG_NAME () {
    return 'List'
  }

  generateNewParser (xml) {
    return new VoteXmlParser(xml, this.currentParliament)
  }

  xmlToJson () {
    if (!this.isInCurrentParliament()) {
      return null
    }

    const vote = {}

    // only get votes related to bills
    const billNumber = this.getDataInTag('BillNumberCode')
    const name = this.getDataInTag('DecisionDivisionSubject').trim()
    if (billNumber === '' || !this.isFinalDecision(name)) {
      return null
    } else {
      vote.billNumber = billNumber
      vote.name = name
    }

    vote.id = Number(this.getDataInTag('DecisionDivisionNumber'))
    vote.yeas = Number(this.getDataInTag('DecisionDivisionNumberOfYeas'))
    vote.nays = Number(this.getDataInTag('DecisionDivisionNumberOfNays'))
    vote.accepted = (vote.yeas > vote.nays)

    // async data, added separately
    vote.voters = {} // TODO: param voters for the list of voters

    return vote
  }

  isInCurrentParliament () {
    if (typeof this.currentParliament === 'undefined') {
      return true
    }

    const parliamentNumber = Number(this.getDataInAttribute('ParliamentSession', 'parliamentNumber'))
    const parliamentSession = Number(this.getDataInAttribute('ParliamentSession', 'sessionNumber'))
    return this.currentParliament.number === parliamentNumber && this.currentParliament.session === parliamentSession
  }

  // TODO: REFACTOR to use Link instead
  async getVoters (voteId) {
    const url = VoteXmlParser.getVoteParticipantsUrl(voteId)
    const runner = new ScrapeRunner(1, 15000, url, undefined)
    const promisedXmlList = await runner.getXmlContent()
    const xmlList = await Promise.all(promisedXmlList)

    const voteParticipantsXml = xmlList.find(xml => xml.includes(`<DecisionDivisionNumber>${voteId}`))
    return new VoteParticipantsXmlParser(voteParticipantsXml).getAllFromXml()
  }

  isFinalDecision (voteSubject) {
    return voteSubject.includes('3rd reading and adoption')
  }
}

module.exports.VoteXmlParser = VoteXmlParser
