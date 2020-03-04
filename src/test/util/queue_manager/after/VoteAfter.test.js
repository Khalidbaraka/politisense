/* eslint-env jest */
const After = require('../../../../util/queue_manager/actions').After
const AfterAction = After.VoteAfterAction
const Actions = require('../../../../util/action/actions')

const chai = require('chai')
const Assert = chai.assert

describe('VoteAfterAction.js', () => {
  let undertest
  let retrieve = AfterAction.prototype.retrieveBills
  beforeEach(() => {
    AfterAction.prototype.retrieveBills = () => {
      console.log('mocking out firebase call')
    }
    undertest = new AfterAction()
  })

  test('VoteAfterAction.js::findBill locates bill with correct year and same billID as vote', async (done) => {
    const vote = {
      year: 2000,
      billNumber: 42
    }
    let id = 40
    let year = 1998
    const bills = new Array(10)
      .fill({}, 0, 10)
      .map(i => {
        return {
          data: {
            number: id++,
            dateVoted: `${year++}`
          }
        }
      })

    const found = AfterAction.findBill(vote, bills)
    Assert.equal(found.data.number, vote.billNumber)
    Assert(found.data.dateVoted.includes(vote.year) || found.data.dateVoted.includes(vote.year - 1))
    done()
  })

  test('VoteAfterAction.js::retreiveBills calls Firestore with correct parliament', async (done) => {
    const desired = [43, 'bill', 'select']
    const order = []

    const mockDB = {}
    mockDB.forParliament = (parl) => {
      order.push(desired[0])
      return mockDB
    }
    mockDB.Bill = () => {
      order.push(desired[1])
      return mockDB
    }
    mockDB.select = async () => {
      order.push(desired[2])
      return [{
        data: () => {return 'a'},
        id: 'a'
      }]
    }
    undertest.retrieveBills = retrieve
    await undertest.retrieveBills(mockDB)
    Assert.equal(order.length, 24)
    for(let i = 0; i < desired.length; i++)
    {
      Assert.equal(desired[i], order[i % 3])
    }
    done()
  })

  test('VoteAfterAction.js::attachBillsToVotes ', async (done) => {
    let num = 0
    undertest.bills = new Array(8)
      .fill({}, 0, 8)
      .map(i => {
        let id = 40
        let year = 1998
        return new Array(10)
            .fill({}, 0, 10)
            .map(i => {
              return {
                data: {
                  number: id++,
                  dateVoted: `${year++}`
                },
                id: `${num++}`
              }
            })
      })

    let billNumber = 40
    let year = 1998
    undertest.manager = {
      result: [{
          params: {
            params: {
              parlSession: 153
            }
          },

          data: [new Array(10)
            .fill({}, 0, 10)
            .map(i => {
              return {
                billNumber: billNumber++,
                year: year++,
                bill: ''
              }
            })
            ]
      }]
  }

    await undertest.perform()

    undertest.manager.result.forEach(datum => {
      datum.data[0].forEach((record, i) => {
        const bill = undertest.bills[7][i]
        Assert.equal(record.bill, bill.id)
      })
    })
    done()
  })
})