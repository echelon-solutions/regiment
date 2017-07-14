const low = require('lowdb')

export interface Fields {
  profile?: string
  region?: string
  stack?: string
  bucket?: string
  parameters?: string
}

export class Config {
  db: Lowdb.Lowdb
  constructor () {
    this.db = low('config.json')
  }
  save (fields: Fields) {
    if (fields) {
      if (fields.profile) {
        this.db.set('profile', fields.profile).write()
      }
      if (fields.region) {
        this.db.set('region', fields.region).write()
      }
      if (fields.stack) {
        this.db.set('stack', fields.stack).write()
      }
      if (fields.bucket) {
        this.db.set('bucket', fields.bucket).write()
      }
      if (fields.parameters) {
        this.db.set('parameters', fields.parameters).write()
      }
    }
  }
  get (): Fields {
    return this.db.getState()
  }
}

