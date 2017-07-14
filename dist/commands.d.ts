/// <reference types="chalk" />
import * as chalk from 'chalk';
import { Fields, Config } from './config';
export interface Arguments {
    options?: Fields;
}
export declare class Commands {
    color: chalk.Chalk;
    config: Config;
    constructor();
    configure(args: Arguments): Promise<void>;
    deploy(): Promise<void>;
    retreat(): Promise<void>;
}
