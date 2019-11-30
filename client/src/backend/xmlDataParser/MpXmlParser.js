import { XmlDataParser } from './XmlDataParser'
import { LinkScraper } from '../../scraper/job_actions/LinkScraperAction'

const cheerio = require('cheerio')

class MpXmlParser extends XmlDataParser {
  constructor (xml, mustBeACurrentMember = false) {
    super(xml)
    this.mustBeACurrentMember = mustBeACurrentMember
  }

  get tagName () {
    return 'MemberOfParliament'
  }

  get listTagName () {
    return 'ArrayOfMemberOfParliament'
  }

  generateNewParser (xml) {
    return new MpXmlParser(xml, this.mustBeACurrentMember)
  }

  xmlToJson () {
    if (!this.passesFilters()) {
      return null
    }

    const mp = {}

    try {
      const name = this.getDataInTag('PersonOfficialFirstName') + ' ' + this.getDataInTag('PersonOfficialLastName')
      mp.name = name.toLowerCase()
      mp.politicalParty = this.getDataInTag('CaucusShortName').toLowerCase()
      mp.riding = this.getDataInTag('ConstituencyName').toLowerCase()
      mp.yearElected = Number(this.getDataInTag('FromDateTime').substring(0, 4))
    } catch (e) {
      console.debug(e.message)
      return null
    }

    // async data, added separately
    mp.imageUrl = ''

    return mp
  }

  passesFilters () {
    return (!this.mustBeACurrentMember || this.isACurrentMember())
  }

  isACurrentMember () {
    const dateEnded = this.getDataInTag('ToDateTime', true)
    return dateEnded === ''
  }

  hasData () {
    return super.hasData() || this.isTagInXml(this.tagName + 'Role')
  }

  getWebPageWithMpImage (mpName) {
    return `https://www.ourcommons.ca/Members/en/search?searchText=${mpName}&parliament=all`
  }

  async getMpImageUrl (mpName) {
    const linkScraper = new LinkScraper(this.getWebPageWithMpImage(mpName))

    const htmlWithMpImage = await linkScraper.perform()
      .then(res => {
        return res.body
      }).then(html => {
        return html
      }).catch(e => {
        console.error(e.message)
        return ''
      })

    if (htmlWithMpImage === '') {
      return ''
    }

    const $ = cheerio.load(htmlWithMpImage)
    return 'https://www.ourcommons.ca' + $('img.ce-mip-mp-picture').attr('src')
  }
}

module.exports.MpXmlParser = MpXmlParser