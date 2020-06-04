/**
  * Means supplying a wrong/invalid package name
  @extends {Error}
*/

class InvalidPackage extends Error {
  constructor(msg) {
    super(msg);
  }
}

module.exports = InvalidPackage;
