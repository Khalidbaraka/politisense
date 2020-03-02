const QueueActions = require('../actions')
const QueueAction = QueueActions.QueueAction
const BillPDFFetchJob = require('../../../job/BillPDFFetchJob').PDFRetrievalJob

class BillPDFFetchStartAction extends QueueAction {
  constructor (manager) {
    super()
    this.manager = manager
  }

  perform () {
    const first = BillPDFFetchJob.create(
      this.manager.params.shift(),
      this.manager.requeueCallback.bind(this.manager)
    )
    this.manager.params.forEach(param => {
      this.manager.queue.enqueue(
        BillPDFFetchJob.create(
          param,
          this.manager.requeueCallback.bind(this.manager)
        )
      )
    })
    return first.execute()
  }
}

module.exports.BillPDFFetchStartAction = BillPDFFetchStartAction