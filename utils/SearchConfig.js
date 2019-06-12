module.exports = class SearchConfig{
    constructor(config){
        this.config = config
    }
    attachPage(page){
        this.page = page
    }
    async _checkForParam({
        name,
        selectId,
        mapping
    }){
        if(this.config[name]){
            if(!Object.keys(mapping).includes(this.config[name]))
                throw new Error(`Invalid value for ${name} param`)
            await this.page.select(`[id='form:${selectId}Select']`, mapping[this.config[name]])
        }
    }
    get limit(){
        return this.config.limit
    }
    async fillForm(){
      
        await this._checkForParam({
            name: 'schoolType',
            selectId: 'schoolType',
            mapping: {
                highschool: 'GENERAL_SECONDARY_SCHOOL',
                technicalSchool: 'TECHNICAL_SECONDARY_SCHOOL',
                vocationalSchool: 'BASIC_VOCATIONAL_SCHOOL'
            }
        })
        await this._checkForParam({
            name: 'city',
            selectId: 'city',
            mapping: {
                'Góra Kalwaria': '0920321',
                'Komornica': '0008510',
                'Konstancin-Jeziorna': '0920634',
                'Legionowo': '0920806',
                'Marki': '0920901',
                'Nasielsk': '0930740',
                'Nowy Dwór Mazowiecki': '0921148',
                'Piaseczno': '0921438',
                'Pomiechówek': '0006860',
                'Radzymin': '0921591',
                'Serock': '0921645',
                'Stanisławów Pierwszy': '0005693',
                'Sulejówek': '0921668',
                'Tarczyn': '0009478',
                'Tłuszcz': '0966441',
                'Urle': '0673383',
                'Warszawa': '0918123',
                'Wołomin': '0921792',
                'Zielonka': '0921970',
                'Żyrardów': '0977210'
            }
        })
        await this._checkForParam({
            name: 'disabledFriendly',
            selectId: 'buildingForDisabled',
            mapping: {
                true: 'FULLY_ADAPTED',
                false: 'NOT_ADAPTED',
                partly: 'ADAPTED_PARTIALLY'
            }
        })
        await this._checkForParam({
            name: 'type',
            selectId: 'specificType',
            mapping: {
                bilingual: 'BILINGUAL',
                integration: 'INTEGRATION_PLACES_FOR_NON_DISABLED',
                athletic: 'ATHLETIC',
                integrationForDisabled: 'INTEGRATION_PLACES_FOR_DISABLED',
                generalAvailability: 'GENERAL_AVAILABILITY',
                international: 'INTERNATIONAL',
                sportsMastery: 'SPORTS_MASTERS'
            }
        })
        await this._checkForParam({
            name: 'test',
            selectId: 'datEnabled',
            mapping: {
                true: 'true',
                false: 'false'
            }
        })
        if(this.config.languages){
            if(!Array.isArray(this.config.launguages))
                throw new Error('Languages param is not an array')
            for (let i = 0; i < this.config.launguages.length; i++) {
                const lang = this.config.launguages[i];
                if(!Object.keys(languagesMapping).includes(lang))
                    throw new Error('Not supported language')
                await page.select(`[id='form:foreignLanguageSelect']`, schoolTypeMapping[lang])
                await page.click(`[id='form:addForeignLanguageBtn']`)
            }
        }
        if(this.config.query){
            if(this.config.query.length > 0){
                await this.page.type(`[id='form:advSearchPhrase']`, this.config.query)
                console.log(this.config.query)
            }
        }
    }
}