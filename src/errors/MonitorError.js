/**
  * Monitor failed to retrieve status
  @extends {Error}
*/

class MonitorError extends Error {
  constructor (msg) {
    super(msg)
  }
}

module.exports = MonitorError
