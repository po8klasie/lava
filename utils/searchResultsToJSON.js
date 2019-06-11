const { Transform } = require('stream')
const searchResultsToJSON = new Transform({
    objectMode: true
})

searchResultsToJSON._written = false

searchResultsToJSON._transform = function(chunk, encoding, next){
    this.push(this._written ? ',' : '[');
    this.push(JSON.stringify(chunk))
    this._written = true
    next()
}
searchResultsToJSON._flush = function(cb){
    this.push(']')
    cb()
}

module.exports = searchResultsToJSON