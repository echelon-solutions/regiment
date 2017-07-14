"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("./commands");
let vorpal = require('vorpal')();
let commands = new commands_1.Commands();
vorpal
    .command('configure', 'Configure the regiment CLI.')
    .option('--region <region>', 'the AWS region identifier to target')
    .option('--profile <profile>', 'the AWS profile name for authentication')
    .option('--bucket <bucket>', 'the AWS S3 bucket name for deployment artifacts')
    .option('--stack <stack>', 'the AWS CloudFormation stack name')
    .option('--parameters <parameters>', 'the parameters file for CloudFormation parameters')
    .action(function (args) {
    return commands.configure(args);
});
vorpal
    .command('deploy', 'Deploy the AWS CloudFormation Stack configuration.')
    .action(function (args, cb) {
    return commands.deploy();
});
vorpal
    .command('retreat', 'Delete the AWS CloudFormation Stack.')
    .action(function (args, cb) {
    return commands.retreat();
});
vorpal
    .delimiter('regiment | ')
    .show();
