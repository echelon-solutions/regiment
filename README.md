# @echelon-solutions/regiment

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

A command line tool that facilitates AWS CloudFormation deployments and stays out of your way.

## Install

Use [npm](https://npmjs.com/) to install.

```sh
npm install -g @echelon-solutions/regiment
```

## Usage

[![NPM](https://nodei.co/npm/@echelon-solutions/regiment.png)](https://www.npmjs.com/package/@echelon-solutions/regiment)

### Help

Run `help` to learn more about each command.

```sh
regiment help configure
regiment help deploy
regiment help retreat
```

### Configure

Create a local config.json file.

```sh
regiment configure \
  --region <aws-region> \
  --profile <aws-profile> \
  --stack <stack-name> \
  --bucket <bucket-name> \
  --parameters-file <parameters-file>
```

### Deploy

Deploy the AWS CloudFormation Stack to the cloud.

```sh
regiment deploy
```

### Retreat

Delete the AWS CloudFormation Stack.

```sh
regiment retreat
```

## License

MIT, see [LICENSE.md](http://github.com/echelon-solutions/regiment/blob/master/LICENSE.md) for details.
