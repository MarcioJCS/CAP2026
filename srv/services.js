const cds = require('@sap/cds')

class ProcessorService extends cds.ApplicationService {

  init() {

    this.before("UPDATE", "Incidents", (req) =>
      this.onUpdate(req)
    )

    this.before("CREATE", "Incidents", (req) =>
      this.changeUrgencyDueToSubject(req.data)
    )

    return super.init()
  }

  changeUrgencyDueToSubject(data) {
    if (data.title?.match(/urgent/i)) {
      data.urgency_code = 'H'
    }
  }

  async onUpdate(req) {
    const { Incidents } = cds.entities

    const incident = await SELECT.one.from(Incidents)
      .columns('status_code')
      .where({ ID: req.data.ID })

    if (incident?.status_code === 'C') {
      req.reject(`Can't modify a closed incident!`)
    }
  }
}

module.exports = { ProcessorService }