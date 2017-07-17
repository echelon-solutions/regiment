/*
 * Imports
 *
 * Using the ShellJS library, to provide portable Unix shell
 *   commands for Node.js. Read more at:
 *   http://shelljs.org
 */
import * as path from 'path'
import * as shell from 'shelljs'
import * as chalk from 'chalk'
import { Fields, Config } from './config'

export interface Arguments {
  options?: Fields
}

export class Commands {
  color: chalk.Chalk
  config: Config
  constructor () {
    this.color = new chalk.constructor({ enabled: true })
    this.config = new Config()
  }
  configure (args: Arguments) {
    let self = this
    return Promise
    .resolve()
    .then(function () {
      if (!args || !args.options || Object.keys(args.options).length === 0) {
        throw new Error('ERROR | This script requires arguments to be supplied.')
      }
      self.config.save(args.options)
      console.log(self.color.green('SUCCESS | Configuration saved to the config.json file.'))
      return
    })
    .catch(function (error) {
      console.error(self.color.red('ERROR | Unable to save configuration to the config.json file.'))
      console.error(self.color.red(error.message))
      return
    })
  }
  deploy () {
    let self = this
    return Promise
    .resolve()
    .then(function () {
      console.log(self.color.inverse('Checking for local installation of the AWS CLI ...'))
      if (!shell.which('aws')) {
        throw new Error('ERROR | This script requires the AWS CLI to be installed.')
      }
      console.log(self.color.inverse('Loading the config.json configuration file ...'))
      let config = self.config.get()
      /* Check args are available */
      if (!config.bucket || !config.parameters || !config.profile || !config.region || !config.stack) {
        throw new Error('ERROR | This script requires a complete config.json file.')
      }
      let parametersString = ''
      try {
        var parametersFilePath = path.join(process.cwd(), config.parameters)
        console.log(self.color.inverse('Reading CloudFormation parameters from ' + parametersFilePath + ' ...'))
        var parameters = require(parametersFilePath)
        if (parameters.length > 0) {
          parametersString += '--parameter-overrides '
          for (var i = 0, len = parameters.length; i < len; i++) {
            parametersString += (parameters[i].ParameterKey + '=' + parameters[i].ParameterValue + ' ');
          }
        }
      }
      catch (e) {
        console.error(e)
        throw new Error('ERROR | Unable to read the parameters from the --parameters-file named ' + config.parameters);
      }
      /* Define the deployment commands. */
      /*
      * We always use the same 'aws s3 mb' command to attempt to create the 
      * bucket, even if it already exists.
      * 
      * 'BucketAlreadyOwnedByYou' errors will only be returned outside of the 
      * US Standard region (us-east-1). Inside the US Standard region (i.e. 
      * when you don't specify a location constraint), attempting to recreate 
      * a bucket you already own will succeed.
      * Source http://docs.aws.amazon.com/AmazonS3/latest/API/ErrorResponses.html
      */
      let bucketCommand = 'aws s3 mb s3://' + config.bucket + ' --region us-east-1 --profile ' + config.profile
      let packageCommand = 'aws cloudformation package --template-file ./cloudformation.yaml --s3-bucket ' + config.bucket + ' --output-template-file packaged-cloudformation.yaml --region ' + config.region + ' --profile ' + config.profile
      let deployCommand = 'aws cloudformation deploy --template-file ./packaged-cloudformation.yaml --stack-name ' + config.stack + ' --capabilities CAPABILITY_NAMED_IAM ' + parametersString + ' --region ' + config.region + ' --profile ' + config.profile;
      /* Run the deployment steps by executing the commands. */
      /* Create the staging area for CloudFormation packaging of artifacts */
      if (shell.exec(bucketCommand).code !== 0) {
        throw new Error('ERROR | CloudFormation staging area S3 bucket creation failed.')
      }
      /* Resolve references in the CloudFormation template by packaging and uploading the packaged template to S3 */
      console.log(self.color.inverse('Running the CloudFormation package command.'))
      console.log(packageCommand)
      if (shell.exec(packageCommand).code !== 0) {
        throw new Error('ERROR | CloudFormation package failed.')
      }
      /* Deploy the CloudFormation infrastructure */
      console.log(self.color.inverse('Running the CloudFormation deploy command.'))
      console.log(deployCommand)
      let result = shell.exec(deployCommand)
      if (result.code !== 0) {
        if (result.code == 255 && result.stderr.indexOf('No changes to deploy. Stack ' + config.stack + ' is up to date') > -1) {
          // Ignore (not a real CloudFormation error, currently an open GitHub issue for the AWS CloudFormation API)
        } else {
          throw new Error('ERROR | CloudFormation deploy failed.')
        }
      }
      return
    })
    .catch(function (error) {
      console.error(self.color.red('ERROR | Unable to deploy to AWS.'))
      console.error(self.color.red(error.message))
      return
    })
  }
  retreat () {
    let self = this
    return Promise
    .resolve()
    .then(function () {
      /* Check for the availability of required installations. */
      if (!shell.which('aws')) {
        throw new Error('ERROR | This script requires the AWS CLI to be installed.')
      }
      /* Get configuration */
      let config = self.config.get()
      /* Check args are available */
      // Truly, only region, profile, and stack are required here
      if (!config.bucket || !config.parameters || !config.profile || !config.region || !config.stack) {
        throw new Error('ERROR | This script requires a complete config.json file.')
      }
      /* Define a common command suffix */
      let commandSuffix = '--region ' + config.region + ' --profile ' + config.profile;
      /* Define the un-deployment commands. */
      let deleteCommand = 'aws cloudformation delete-stack --stack-name ' + config.stack + ' ' + commandSuffix;
      /* Run the undeployment steps by executing the commands. */
      // Un-deploy the CloudFormation stack infrastructure
      if (shell.exec(deleteCommand).code !== 0) {
        throw new Error('ERROR | CloudFormation un-deploy failed.')
      }
      return
    })
    .catch(function (error) {
      console.error(self.color.red('ERROR | Unable to retreat from AWS.'))
      console.error(self.color.red(error.message))
      return
    })
  }
}
