const Get = require('request-promise'),
  cheerio = require('cheerio'),
  InvalidPackage = require('../../errors/InvalidPackage.js'),
  h2m = require('html-to-md'),
  endpoint = require('../../static/endpoints.json').npm.package,
  User = require('./User.js')

// Typedefs
/**
@typedef {Object} Dependencies - The package's dependencies.
@property {Package[]} normal - The array of normal dependencies , instances of the {@link Package Package} class.
@property {Package[]} dev - The array of dev dependencies , instances of the {@link Package Package} class.
*/
/**
@typedef {Array} Versions - The array of versions , instances of the {@link Package Package} class with a specified version.
*/
/**
@typedef {Object} Packages - The packages resulting from a search .
@property {Package[]} packages - The array of packages , instances of the {@link Package Package} class.
@property {number} total - Number of total search results
*/
/**
@typedef {Array} Collaborators - The array of collaborators , instances of the {@link User User} class.
*/
/** The package class, holds information for a valid npm package */
class Package {
  /**
  * Create a new package by its name
  @param {string} name - The name of the package, this is strict.
  @param {string=} version - The package's version, leave it empty for the latest.
  */
  constructor (name, version) {
    this.name = name
    this.version = version
    this.versionAppend = this.version ? `/v/${this.version}` : ''
  }
  /**
  * Get the main info about the package.
  @returns {Object} The overall info, this is completly dynamic depending on what's available
  @throws {InvalidPackage}
  @example
  * // Example output from the upjson package, the properties are pretty clear
  * const result = {
  *  description: 'upjson, edit and write data to a json file asynchronously using
  *  db-like methods with the es6 syntax',
  *  keywords: [ 'json', 'db', 'wrapper' ],
  *  install: 'npm i upjson',
  *  version: '1.0.1',
  *  license: 'Apache-2.0',
  *  unpackedSize: '22.8 kB',
  *  totalFiles: '10',
  *  homepage: 'github.com/Mahdios/upjson',
  *  repository: 'Gitgithub.com/Mahdios/upjson',
  *  lastPublish: '3 hours ago'
  * }
  */
  async snippet () {
    return Get({
      uri: `${endpoint.main}${this.name.replace(
        / /g,
        '-'
      )}${this.versionAppend}`,
      transform: body => {
        return cheerio.load(body)
      }
    })
      .then($ => {
        const result = {
          description: $('head > meta:nth-child(12)').attr('content'),
          keywords: []
        }
        const clean = string => {
          let parts = string.split(' ')
          parts.forEach((part, i) => {
            if (i == 0) {
              parts[i] = part.slice(0, 1).toLowerCase() +
                part.slice(1, part.length)
            } else {
              parts[i] = part.slice(0, 1).toUpperCase() +
                part.slice(1, part.length)
            }
          })
          return parts.join('')
        }
        $(
          '#top > div.fdbf4038.w-third-l.mt3.w-100.ph3.ph4-m.pv3.pv0-l.order-1-ns.order-0'
        )
          .find('p')
          .each((i, e) => {
            result[clean($(e).prev().text())
              ? clean($(e).prev().text())
              : 'weeklyDownloads'] = $(e).text()
          })
        $(
          '#top > div._6620a4fd.mw8-l.mw-100.w-100.w-two-thirds-l.ph3-m.pt2.pl0-ns.pl2.order-1-m.order-0-ns.order-1.order-2-m > section > div.pv4 > ul'
        )
          .children()
          .each((i, li) => {
            result.keywords.push($(li).find('a').text())
          })
        return result
      })
      .catch(e => {
        throw new InvalidPackage(`${this.name} is probably invalid.`)
      })
  }
  /**
  * Gets the dependencies related to this package
  @returns {Dependencies} The dependencies related to this package
  @throws {InvalidPackage}
  */
  async dependencies () {
    return Get({
      uri: `${endpoint.main}${this.name}${this.versionAppend}?activeTab=dependencies`,
      transform: body => {
        return cheerio.load(body)
      }
    })
      .then($ => {
        const data = { normal: [], dev: [] }
        $('#dependencies > ul').each((i, ul) => {
          switch (i) {
            case 0:
              $(ul).children().each((i, li) => {
                data.normal.push(new Package($(li).find('a').text()))
              })
              break
            default:
              $(ul).children().each((i, li) => {
                data.dev.push(new Package($(li).find('a').text()))
              })
          }
        })
        return data
      })
      .catch(e => {
        throw new InvalidPackage(`${this.name} is probably invalid.`)
      })
  }

  /**
  * Retrieve a package's readme, formatted in html or markdown
  @param {string=} [format = 'html'] - The format you want the output in , md or html (strictly) . Defaults to html otherwhise.
  @param {Object=} [options = {}] - Controller for the switch between html and md , identical to {@link https://www.npmjs.com/package/html-to-md html-to-md}'s options param
  @returns {(HTML|Markdown)} The readme
  @throws {InvalidPackage}
  */
  async readme (format = 'html', options = {}) {
    if (![ 'md', 'html' ].includes(format)) format = 'html'
    return Get({
      uri: `${endpoint.main}${this.name}${this.versionAppend}`,
      transform: body => {
        return cheerio.load(body)
      }
    })
      .then($ => {
        return format == 'html'
          ? $('#readme').html()
          : h2m($('#readme').html(), options)
      })
      .catch(e => {
        throw new InvalidPackage(`${this.name} is probably invalid.`)
      })
  }

  /**
  * Retrieve this package's version log
  @returns {Versions} The package's version log (through-out the package's lifecycle).
  @throws {InvalidPackage}
  */
  async versions () {
    return Get({
      uri: `${endpoint.main}${this.name}${this.versionAppend}?activeTab=versions`,
      transform: body => {
        return cheerio.load(body)
      }
    })
      .then($ => {
        const data = []
        $('#versions > div > ul:nth-child(5)').children().each((i, li) => {
          data.push(new Package(this.name, $(li).find('a').text()))
        })
        return data
      })
      .catch(e => {
        throw new InvalidPackage(`${this.name} is probably invalid.`)
      })
  }

  /**
  * Search the website for packages, you can do anything you would do manually.
  @param {string} query - The query to search for.
  @param {Object=} [options={}] - In case you want to customize your search, supply keywords, filters and more
  @param {Array} options.keywords - The keywords to filter by the search
  @param {string} options.rating - The rating to sort with, could be one of optimal, popularity, quality and maintenance
  @param {number} [options.pageNumber=0] - The page to get results from, make sure the query you're searching for extends to the number of pages you're supplying . This also acts similar to array indexes
  @param {number} [options.maxResultsOnPage=20] - The number of results to display on one page, behaves like the max amount of results to recieve
  @returns {Packages}
  @throws {Error} If the parser fails to do it's job or the website is down
  @example
  * // Search for a the term 'lo'
  * const { Package } = require('npm-utilities');
  * Package.search('lo').then(console.log).catch(console.error);
  */
  static async search (query, options = {}) {
    const processURL = (url, query, options) => {
      if (options.keywords && Array.isArray(options.keywords)) {
        query += ` keywords:${options.keywords.join(',')}`
      }
      url += query
      if (
        options.ranking &&
          [ 'optimal', 'popularity', 'quality', 'maintenance' ].includes(
            options.ranking
          )
      ) {
        url += `&ranking=${options.ranking}`
      }
      if (!isNaN(options.pageNumber)) url += `&page=${options.pageNumber}`
      if (!isNaN(options.maxResultsOnPage)) {
        url += `&perPage=${options.maxResultsOnPage}`
      }
      return encodeURI(url)
    }
    if (!query) throw new Error('I need that query, thanks')
    return Get({
      uri: processURL(endpoint.search, query, options),
      transform: body => {
        return cheerio.load(body)
      }
    })
      .then($ => {
        const data = {
          packages: [],
          total: parseInt(
            $(
              '#app > div > div.flex.flex-column.vh-100 > main > div.a9b7335e.bb.b--black-10 > div > div:nth-child(1) > h2'
            ).text()
          )
        }
        $(
          '#app > div > div.flex.flex-column.vh-100 > main > div._23fffac0.w-100.mw9.ph5-ns.ph3-l.ph1-m.mh3-ns.center.center-ns.flex.flex-column.flex-row-l.justify-between > div'
        )
          .children()
          .each((i, section) => {
            data.packages.push(new Package(
              $(section)
                .find('div.w-80 > div.flex.flex-row.items-end.pr3 > a')
                .text()
            ))
          })
        return data
      })
      .catch(e => {
        console.error(e)
        throw new Error(
          'The website is down or the parser failed to parse it.'
        )
      })
  }

  /**
  * Retrieve the collaborators of a package
  @returns {Collaborators}
  @throws {InvalidPackage}
  */
  async collaborators () {
    return Get({
      uri: `${endpoint.main}${this.name}${this.versionAppend}`,
      transform: body => {
        return cheerio.load(body)
      }
    })
      .then($ => {
        const data = []
        $('div > a > img').each((i, img) => {
          data.push(new User($(img).attr('title')))
        })
        return data
      })
      .catch(e => {
        throw new InvalidPackage(`${this.name} is probably invalid.`)
      })
  }
}
module.exports = Package
