/// <reference types="lowdb" />
export interface Fields {
    profile?: string;
    region?: string;
    stack?: string;
    bucket?: string;
    parameters?: string;
}
export declare class Config {
    db: Lowdb.Lowdb;
    constructor();
    save(fields: Fields): void;
    get(): Fields;
}
