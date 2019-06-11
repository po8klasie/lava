const cheerio = require('cheerio')
const axios = require('axios')
const TurndownService = require('turndown')()
String.prototype.decodeEntites = function(){
    return require('decode-entities')(this)
}
module.exports = class School{
    constructor({
        id
    }){
        this.id = id
        this.$ = null
        // this.getDescription = this.getDescription.bind(this)
    }
    async load(){
        console.log(this.baseURL)
        let res = await axios.get(`${this.baseURL}/kandydat/app/offer_school_details_pg.xhtml?schoolId=${this.id}`, {
            responseType: 'text'
        })
        this.$ = cheerio.load(res.data)
    }
    getClasses(){
       
        return this.$('.offer_school_table tbody tr').map((i, el) => {
            const cols = this.$(el).find('td')
            const _class = {}
            const titleMatch = /<a href=".+groupId=(\d+)">(.+)<\/a>/.exec(this.$(el).find('td').eq(0).html())
            _class.id = parseInt(titleMatch[1])
            _class.title = titleMatch[2]
            _class.extendedSubjects = cols.eq(1).html().decodeEntites().split('<br>').filter(subject => subject)
            _class.spotsAmount = parseInt(cols.eq(3).text())
            _class.lang = {}
            const langsArr = cols.eq(2).html().split('<br>')
            _class.lang.first = langsArr[0].replace('Pierwszy: ', '').trim().decodeEntites()
            _class.lang.second = langsArr[1].replace('Drugi: ', '').trim().decodeEntites().match(/język [^ ]+/g)
            return _class
        })
    }
    getDescription(){
        return this.$('.cms').map((i, el) => ({
            title: this.$(el).prev().text(),
            content: TurndownService.turndown(this.$(el).html())
        })).get()
    }
    getAdditionalInfo(){
                return {
            isPublic: /Status publiczności: (Publiczna|Niepubliczna)/
                    .exec(this.$('#workspaceWrapper').text())[1],
            disabledFriendly: /Budynek przystosowany dla osób niepełnosprawnych: (Przystosowany częściowo|Nieprzystosowany|Przystosowany)/
                            .exec(this.$('#workspaceWrapper').text())[1]
        }
        // this.$('#workspaceWrapper').text()
        // console.log(this.$("h2:contains('Dodatkowe informacje')").text())
    }
}