# Lava
API wrapper for Vulcan recruitment system.

## Installation

```bash
yarn add @warsawlo/lava
```

## Usage
```javascript
const fs = require('fs')

const SearchConfig = require('@warsawlo/lava/utils/SearchConfig')
const searchResultsToJSON = require('@warsawlo/lava/utils/searchResultsToJSON')
const { 
    WARSAW_AFTER_SECONDARY_SCHOOL_URL,
    WARSAW_AFTER_PRIMARY_SCHOOL_URL
    } = require('@warsawlo/lava/urls/2019')

const Lava = require('./src/Lava')({
  baseURL: WARSAW_AFTER_SECONDARY_SCHOOL_URL
});

(async () => {
  const Search = new Lava.Search()
  const results = await Search.search(new SearchConfig({
    query: 'batorego',
    city: 'Warszawa'
  }))
  await Search.cleanUp()
  results
  .pipe(searchResultsToJSON)
  .pipe(fs.createWriteStream('./schools.json'))


  const school = new Lava.School({
    id: 104
  })
  await school.load()

  school.getDescription()
  school.getClasses()
  school.getAdditionalInfo()
})()
```

## Docs
To view docs go to [our wiki](https://github.com/WarsawLO/lava/wiki)