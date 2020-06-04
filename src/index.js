module.exports = {
  Package: require('./classes/NPM/Package.js'),
  User: require('./classes/npm/User.js'),
  StatusMonitor: require('./classes/npm/StatusMonitor.js')
}
require('./classes/npm/StatusMonitor.js')
  .incident('kg3mk6qmwxsg')
  .then(console.log)
