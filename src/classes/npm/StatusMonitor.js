const Get = require('request-promise'),
  endpoint = require('../../static/endpoints.json').npm.status,
  MonitorError = require('../../errors/MonitorError.js'),
  cheerio = require('cheerio')
/** The StatusMonitor class, holds the static methods (all of them) used to interact with the npmjs status page */
class StatusMonitor {
  constructor () {
  }
  /**
  * Retrieve the overall status of npmjs
  @returns {JSON}
  @throws {MonitorError}
  */
  static async overall () {
    return Get({ uri: `${endpoint.main}api/v2/status.json`, json: true })
      .then(body => {
        return body
      })
      .catch(e => {
        throw new MonitorError(
          'Monitor failed to start, contact the developer to debug this.'
        )
      })
  }
  /**
  * Get a summary of the status page, including a status indicator, component statuses, unresolved incidents, and any upcoming or in-progress scheduled maintenances.
  @throws {MonitorError}
  @returns {JSON}
  */
  static async summary () {
    return Get({ uri: `${endpoint.main}api/v2/summary.json`, json: true })
      .then(body => {
        return body
      })
      .catch(e => {
        throw new MonitorError(
          'Monitor failed to start, contact the developer to debug this.'
        )
      })
  }
  /**
  * Get the components for the page. Each component is listed along with its status - one of operational, degraded_performance, partial_outage, or major_outage.
  @throws {MonitorError}
  @returns {JSON}
  */
  static async components () {
    return Get({ uri: `${endpoint.main}api/v2/components.json`, json: true })
      .then(body => {
        return body
      })
      .catch(e => {
        throw new MonitorError(
          'Monitor failed to start, contact the developer to debug this.'
        )
      })
  }
  /**
  * Get a list of any unresolved incidents. This endpoint will only return incidents in the Investigating, Identified, or Monitoring state.
  @throws {MonitorError}
  @returns {JSON}
  */
  static async unresolvedIncidents () {
    return Get({
      uri: `${endpoint.main}api/v2/incidents/unresolved.json`,
      json: true
    })
      .then(body => {
        return body
      })
      .catch(e => {
        throw new MonitorError(
          'Monitor failed to start, contact the developer to debug this.'
        )
      })
  }
  /**
  * Get a list of the 50 most recent incidents. This includes all unresolved incidents as described above, as well as those in the Resolved and Postmortem state.
  @throws {MonitorError}
  @returns {JSON}
  */
  static async incidents () {
    return Get({ uri: `${endpoint.main}api/v2/incidents.json`, json: true })
      .then(body => {
        return body
      })
      .catch(e => {
        throw new MonitorError(
          'Monitor failed to start, contact the developer to debug this.'
        )
      })
  }
  /**
  * Scheduled maintenances are planned outages, upgrades, or general notices that you're working on infrastructure and disruptions may occurr.
  @throws {MonitorError}
  @returns {JSON}
  */
  static async scheduledMaintenances () {
    return Get({
      uri: `${endpoint.main}api/v2/scheduled-maintenances.json`,
      json: true
    })
      .then(body => {
        return body
      })
      .catch(e => {
        throw new MonitorError(
          'Monitor failed to start, contact the developer to debug this.'
        )
      })
  }
  /**
  * Get a list of any upcoming maintenances. This endpoint will only return scheduled maintenances still in the Scheduled state.
  @throws {MonitorError}
  @returns {JSON}
  */
  static async upcomingScheduledMaintenances () {
    return Get({
      uri: `${endpoint.main}api/v2/scheduled-maintenances/upcoming.json`,
      json: true
    })
      .then(body => {
        return body
      })
      .catch(e => {
        throw new MonitorError(
          'Monitor failed to start, contact the developer to debug this.'
        )
      })
  }
  /**
  * Get a list of any active maintenances. This endpoint will only return scheduled maintenances in the In Progress or Verifying state.
  @throws {MonitorError}
  @returns {JSON}
  */
  static async activeScheduledMaintenances () {
    return Get({
      uri: `${endpoint.main}api/v2/scheduled-maintenances/active.json`,
      json: true
    })
      .then(body => {
        return body
      })
      .catch(e => {
        throw new MonitorError(
          'Monitor failed to start, contact the developer to debug this.'
        )
      })
  }
  /**
  * Retrieve incident data for a specific incident UUID
  @param {string} UUID - The UUID for the incident
  @returns {JSON}
  @throws {MonitorError}
  */
  static async incident (UUID) {
    if (!UUID) throw new Error('I need that UUID, plz.')
    return Get({
      uri: `${endpoint.main}incidents/${UUID}`,
      transform: body => {
        return cheerio.load(body)
      }
    })
      .then($ => {
        const data = {
          message: $(
            '.page-title'
          ).children().first().text(),
          actions: []
        }
        $('.row.update-row').each((i, updateRow) => {
          data.actions.push({
            type: $(updateRow)
              .find('div.update-title.span3.font-large')
              .text()
              .trim(),
            summary: $(updateRow)
              .find('div.update-body.font-regular')
              .text()
              .trim(),
            timestamp: $(updateRow)
              .find('div.update-timestamp.font-small.color-secondary')
              .text()
              .trim()
          })
        })
        return data
      })
      .catch(e => {
        throw new MonitorError('That UUID is wrong.')
      })
  }
}

module.exports = StatusMonitor
