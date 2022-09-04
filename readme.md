<h1 align="center">
  ⚡ Free retro 🗣️
  <br>
</h1>
<h4 align="center">A retro board inspired by retrium</h4>
<p align="center">

<a href="https://github.com/andrewinci/free-retro/actions/workflows/ci.yml">
<img src="https://github.com/andrewinci/free-retro/actions/workflows/ci.yml/badge.svg?branch=main" alt="main"/>
</a>

<a href='https://coveralls.io/github/andrewinci/free-retro?branch=main'>
<img src='https://coveralls.io/repos/github/andrewinci/free-retro/badge.svg?branch=main' alt='Coverage Status' />
</a>

<a href="https://github.com/semantic-release/semantic-release">
<img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg" alt="Build"/>
</a>

<a href="https://snyk.io/test/github/andrewinci/free-retro">
<img src="https://snyk.io/test/github/andrewinci/free-retro/badge.svg" alt="Build"/>
</a>

</p>

Try it [here](https://retroapp.amaker.xyz/)

## Development

Set `DEV_MODE=true` in the browser local storage to then be able to clean up
dynamo from development states.

Download dependencies: `yarn install`

Run tests: `yarn test`

Run locally: `yarn serve`

Deploy to AWS: `yarn deploy`

### Project structure

- `artifacts`: media used in the frontend app
- `src`: the code is here
  - `app`: frontend application
  - `infra`: cdk infra configuration
  - `lambda`: aws lambda code
  - `scripts`: mostly migration script for dynamodb
  - `stories`: storybook stories to test components
  - `tg-forwarder`: aws lambda to forward alerts to telegram

## Todo

- [x] List of actions
- [x] Balance votes with number of tickets
- [x] Show votes in UI
- [x] TTL in dynamodb
- [ ] Timer tool
- [ ] Users management
