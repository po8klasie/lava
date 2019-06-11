const Search = require('./Search')
const School = require('./School')
module.exports = (globalConfig) => {
    Search.prototype.baseURL = globalConfig.baseURL
    School.prototype.baseURL = globalConfig.baseURL
    return {
        Search,
        School
    }
}