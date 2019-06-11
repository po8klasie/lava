const puppeteer = require('puppeteer')

const { Readable } = require('stream')

module.exports = class Search{
    async init(){
        this.browser = await puppeteer.launch()
        this.page = await this.browser.newPage()
        await this.page.goto(`${this.baseURL}/kandydat/app/offer_pg.html`)
        await this.page.click(`[value='Wyszukiwanie zaawansowane']`)
        await this.page.waitForSelector(`[value='Wyszukiwanie proste']`)
    }
    async search(config){
        
        if(!this.page)
            await this.init()


        config.attachPage(this.page)
        await config.fillForm()
        await Promise.all([
            this.page.waitForNavigation(),
            this.page.click(`[name='form:searchBtn']`),
        ])
        await Promise.all([
            this.page.waitForNavigation(),
            this.page.click(`[id='form:switchToMapBtn']`),
        ])
        console.log('Setting up the page finished')
        const scripts = (await this.page.$$eval(`script`, nodes => nodes.map(n => n.innerText))).join(' ')
        const regex = /marker\.bindPopup\('<a href="offer_school_details_pg\.xhtml\?schoolId=(\d+)">(.+)<\/a>'\)/g
        let match = []
        let i = 0
        let limit = 5
        console.log('Starting processing...')
        const schoolsStream = new Readable({
            objectMode: true
        })
            while ((match = regex.exec(scripts)) != null && i <= limit) {
            schoolsStream.push({
                name: match[2],
                id: match[1]
            })
            console.log(`${i} ${match[2]}`)
            i++
        }
        schoolsStream.push(null)
        return schoolsStream
    }
    async cleanUp(){
        await this.browser.close()
    }
}
