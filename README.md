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

```sh
regiment-deploy \
  --region <aws-region> \
  --profile <aws-profile> \
  --stack-name <stack-name> \
  --bucket-name <bucket-name> \
  --parameters-file <parameters-file>
```

## License

MIT, see [LICENSE.md](http://github.com/echelon-solutions/regiment/blob/master/LICENSE.md) for details.
