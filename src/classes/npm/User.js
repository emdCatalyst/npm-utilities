const Get = require('request-promise'),
  cheerio = require('cheerio'),
  InvalidUser = require('../../errors/InvalidUser.js'),
  Package = require('./Package.js')

/**
@typedef {Array} Packages - The array of packages made by this user , instances of the {@link Package Package} class.
*/
/** The user class, holds information for a valid npm user */
class User {
  /**
  * Create a new user by its username
  @param {string} username - The username of the user, this is strict.
  */
  constructor (username) {
    this.username = username
    this.endpoint = require('../../static/endpoints.json').npm.user
  }

  /**
  /**
  * Get the main info about the user.
  @returns {Object} The overall info, this is completly dynamic depending on what's available
  @throws {InvalidUser}
  @example
  * // Example output from the my profile, the properties are pretty clear
  * const result = {
  *    username: 'mahdios',
  *    name: 'Mahdi Djaber',
  *    avatar: 'https://s.gravatar.com/avatar/83cd682f086e11aff9822c9b73061f81?size=496&default=retro'
  *  }
  */
  async snippet () {
    return Get({
      uri: `${this.endpoint.main}${this.username}`,
      transform: body => {
        return cheerio.load(body)
      }
    })
      .then($ => {
        return {
          username: $(
            '#app > div > div.flex.flex-column.vh-100 > main > div > div._73a8e6f0.w-100.w-auto-l.pv4.pv0-l > div:nth-child(2) > h2'
          ).text(),
          name: $(
            '#app > div > div.flex.flex-column.vh-100 > main > div > div._73a8e6f0.w-100.w-auto-l.pv4.pv0-l > div:nth-child(2) > div > div'
          ).text(),
          avatar: $(
            '#app > div > div.flex.flex-column.vh-100 > main > div > div._73a8e6f0.w-100.w-auto-l.pv4.pv0-l > div:nth-child(1) > a > img'
          ).attr('src')
        }
      })
      .catch(e => {
        throw new InvalidUser(`${this.username} is probably invalid.`)
      })
  }

  /**
  * Retrieve the connections linked by this user.
  @returns {Object[]} The connections linked by this user
  @throws {InvalidUser}
  */
  async connections () {
    return Get({
      uri: `${this.endpoint.main}${this.username}`,
      transform: body => {
        return cheerio.load(body)
      }
    })
      .then($ => {
        const data = []
        $(
          '#app > div > div.flex.flex-column.vh-100 > main > div > div._73a8e6f0.w-100.w-auto-l.pv4.pv0-l > div:nth-child(2) > ul'
        )
          .children()
          .each((i, li) => {
            data.push({
              username: $(li).find('a').text(),
              link: $(li).find('a').attr('href')
            })
          })
        return data
      })
      .catch(e => {
        throw new InvalidUser(`${this.username} is probably invalid.`)
      })
  }

  /**
  * Retrieve the packages made by this user.
  @returns {Packages} The packages made by this user.
  @throws {InvalidUser}
  */
  async packages () {
    return Get({
      uri: `${this.endpoint.main}${this.username}`,
      transform: body => {
        return cheerio.load(body)
      }
    })
      .then($ => {
        const data = []
        $(
          '#app > div > div.flex.flex-column.vh-100 > main > div > div.d2f60d44.w-100.w-auto-l.flex-auto.ph3.ph0-l.pb3-l > div > div'
        )
          .children()
          .each((i, section) => {
            data.push(new Package($(section).find('a > h3').text()));
          })
        return data
      })
      .catch(e => {
        throw new InvalidUser(`${this.username} is probably invalid.`)
      })
  }
}

module.exports = User
