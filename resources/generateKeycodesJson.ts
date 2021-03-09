const fs = require('fs')
const csv = require('csvtojson')

const csvPath = 'resources/qmk_keycodes.csv'
const jsonPath = 'assets/data/BaseKeycodes.json'

csv()
  .fromFile(csvPath)
  .then((array: any) => {
    const parsed = array.reduce(
      (ret: any, v: any) => {
        v.raw = parseInt(v.raw)
        if (v.alt) v.qmk = v.alt
        delete v.alt
        try {
          ret[v.kind].push(v)
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(v.kind)
          throw e
        }
        return ret
      },
      {
        BASIC: [],
        MOD: [],
        KEYPAD: [],
        QMK: [],
        SYSTEM: [],
        PC: [],
        MEDIA: [],
        MOUSE: [],
        LED: [],
      }
    )
    const json = Object.keys(parsed).reduce(
      (ret: any, v: any) => ret.concat(parsed[v]),
      []
    )
    fs.writeFile(jsonPath, JSON.stringify(json, undefined, 2), null, () => {})
  })
