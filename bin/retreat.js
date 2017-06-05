#! /usr/bin/env node

const path = require('path');

/*
 * Using the ShellJS library, to provide portable Unix shell
 *   commands for Node.js. Read more at:
 *   http://shelljs.org
 */
var shell = require('shelljs');

/*
 * Check for the availability of required installations.
 */
if (!shell.which('aws')) {
  shell.echo('ERROR | This script requires the AWS CLI to be installed.');
  shell.exit(1);
}

/*
 * Check for the availability of required command line arguments.
 */
var arguments = {
  region: argumentRequired('--region'),                    // The AWS Region argument
  profile: argumentRequired('--profile'),                  // The AWS Profile argument
  stackName: argumentRequired('--stack-name')              // The CloudFormation stack name argument
};

/*
 * Define a common command suffix
 */
var commandSuffix = '--region ' + arguments.region + ' --profile ' + arguments.profile;

/*
 * Define the un-deployment commands.
 */
var deleteCommand = 'aws cloudformation delete-stack --stack-name ' + arguments.stackName + " " + commandSuffix;

/*
 * Run the undeployment steps by executing the commands.
 */
shell.echo('=============================================================== [START]');

// Un-deploy the CloudFormation stack infrastructure
if (shell.exec(deleteCommand).code !== 0) {
  shell.echo('ERROR | CloudFormation un-deploy failed.');
  shell.exit(1);
}

shell.echo('=============================================================== [END]');

/*
 * Define the private script convenience functions.
 */
function argumentRequired (name) {
  if (process.argv.indexOf(name) == -1) {
    shell.echo('ERROR | This script requires the ' + name + ' argument.');
    shell.exit(1);
  }
  return process.argv[process.argv.indexOf(name) + 1];
}
