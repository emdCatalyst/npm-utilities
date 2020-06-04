/**
  * Means supplying a wrong/invalid username
  @extends {Error}
*/

class InvalidUser extends Error {
  constructor (msg) {
    super(msg)
  }
}

module.exports = InvalidUser
