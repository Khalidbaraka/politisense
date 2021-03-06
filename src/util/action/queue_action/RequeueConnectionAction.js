const JobAction = require('../JobAction').AbstractJobAction

class RequeueConnectionAction extends JobAction {
  constructor (callback, creationFn, topLevelDomains) {
    super()
    this.callback = callback
    this.create = creationFn
    this.tlds = topLevelDomains
  }

  async perform (data) {
    const { other, selected } = data
    const newJobs = []
    other.forEach(link => {
      newJobs.push(this.create(link, this.callback, this.tlds))
    })
    console.log(`INFO: queued ${newJobs.length} new jobs.`)
    this.callback(newJobs)
    return selected
  }
}

module.exports.RequeueAction = RequeueConnectionAction
