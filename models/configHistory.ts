interface ConfigHistoryItem {
  name: string
  src: string
  isPinned: boolean
}

export class ConfigHistory {
  items: ConfigHistoryItem[]
  constructor() {
    const configHistoryJson = window.localStorage.getItem('ConfigHistories')
    this.items = configHistoryJson
      ? JSON.parse(configHistoryJson)
      : [
          {
            name: 'Tartan',
            src:
              'https://gist.githubusercontent.com/hsgw/b9df17b75f12d53e025416af3bd227d8/raw/tartan.json',
            isPinned: false,
          },
        ]
  }

  save() {
    window.localStorage.setItem('ConfigHistories', JSON.stringify(this.items))
  }

  update(config: { name: string; src: string }) {
    if (config.src === 'local') return
    let isPinned = false
    this.items = this.items.filter((v) => {
      if (v.name === config.name) {
        isPinned = v.isPinned
        return false
      }
      return true
    })
    this.items.unshift({ ...config, isPinned })
    this.save()
  }

  togglePin(index: number) {
    this.items[index].isPinned = !this.items[index].isPinned
    this.save()
  }

  remove(index: number) {
    this.items.splice(index, 1)
    this.save()
  }
}
