"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const low = require('lowdb');
class Config {
    constructor() {
        this.db = low('config.json');
    }
    save(fields) {
        if (fields) {
            if (fields.profile) {
                this.db.set('profile', fields.profile).write();
            }
            if (fields.region) {
                this.db.set('region', fields.region).write();
            }
            if (fields.stack) {
                this.db.set('stack', fields.stack).write();
            }
            if (fields.bucket) {
                this.db.set('bucket', fields.bucket).write();
            }
            if (fields.parameters) {
                this.db.set('parameters', fields.parameters).write();
            }
        }
    }
    get() {
        return this.db.getState();
    }
}
exports.Config = Config;
