#! /usr/bin/env node

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
var region = argumentRequired('--region');                    // The AWS Region argument
var profile = argumentRequired('--profile');                  // The AWS Profile argument
var bucketName = argumentRequired('--bucket-name');           // The AWS S3 Bucket name argument
var stackName = argumentRequired('--stack-name');             // The CloudFormation stack name argument
var parametersFile = argumentRequired('--parameters-file');   // The CloudFormation parameters file argument

/*
 * Read the parameters from the parametersFile.
 */
var parametersString = '';
try {
  var parameters = require('./' + parametersFile);
  if (parameters.length > 0) {
    parametersString += '--parameter-overrides ';
    for (var i = 0, len = parameters.length; i < len; i++) {
      parametersString += (parameters[i].ParameterKey + "=" + parameters[i].ParameterValue + " ");
    }
  }
}
catch(e) {
  shell.echo(e);
  shell.echo('ERROR | Unable to read the parameters from the --parameters-file named ' + parametersFile);
  shell.exit(1);
}

/*
 * Define a common command suffix
 */
var commandSuffix = '--region ' + arguments.region + ' --profile ' + arguments.profile;

/*
 * Define the deployment commands.
 */
var bucketCommand = 'aws s3 mb s3://' + arguments.bucketName + " " + commandSuffix;
var packageCommand = 'aws cloudformation package --template-file ./cloudformation.yaml --s3-bucket ' + arguments.bucketName + ' --output-template-file packaged-cloudformation.yaml ' + commandSuffix;
var deployCommand = 'aws cloudformation deploy --template-file ./packaged-cloudformation.yaml --stack-name ' + arguments.stackName + ' --capabilities CAPABILITY_NAMED_IAM ' + arguments.parametersString + commandSuffix;

/*
 * Run the deployment steps by executing the commands.
 */
shell.echo('=============================================================== [START]');

// Create the staging area for CloudFormation packaging of artifacts
if (shell.exec(bucketCommand).code !== 0) {
  shell.echo('ERROR | CloudFormation staging area S3 bucket creation failed.');
  shell.exit(1);
}

// Resolve references in the CloudFormation template by packaging and uploading the packaged template to S3
if (shell.exec(packageCommand).code !== 0) {
  shell.echo('ERROR | CloudFormation package failed.');
  shell.exit(1);
}

// Deploy the CloudFormation infrastructure
var deployCommand = shell.exec(deployCommand);
if (deployCommand.code !== 0) {
  if (deployCommand.code == 255 && deployCommand.stderr.indexOf('No changes to deploy. Stack ' + arguments.stackName + ' is up to date') > -1) {
    // Ignore (not a real CloudFormation error, currently an open GitHub issue for the AWS CloudFormation API)
  } else {
    shell.echo('ERROR | CloudFormation deploy failed.');
    shell.exit(1);
  }
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
