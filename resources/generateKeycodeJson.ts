const fs = require('fs')
const csv = require('csvtojson')

const csvPath = 'resources/qmk_keycodes.csv'
const jsonPath = 'utils/QmkKeycodes.json'

csv()
  .fromFile(csvPath)
  .then((ret: any) => {
    const json = ret.map((v: any) => {
      v.raw = parseInt(v.raw)
      return v
    })
    fs.writeFile(jsonPath, JSON.stringify(json, undefined, 2), null, () => {})
  })
