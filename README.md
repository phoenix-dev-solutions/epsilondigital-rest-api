# Epsilondigital API - Node.js Client

A Node.js client for the Epsilondigital REST API. Easily interact with the Epsilondigital REST API using this library.

## Installation

```js
npm i @phoenixdev/epsilondigital-rest-api
```

```js
yarn add @phoenixdev/epsilondigital-rest-api
```

## Getting started

GET API credentials from Epsilondigital
.

## Setup

Setup for the REST API integration :

```js
const EpsilondigitalRestApi = require('@phoenixdev/epsilondigital-rest-api');

const epsilondigital = new EpsilondigitalRestApi({
  subscriptionKey: 'xxxx',
  email: 'xxxx',
  password: 'xxxx',
  sandbox: false,
  autoLogin: true,
});
```

### Options

| Option            | Type      | Required | Description                                                                                                         |
| ----------------- | --------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `subscriptionKey` | `String`  | yes      | Your subscription key                                                                                               |
| `email`           | `String`  | yes      | Your email                                                                                                          |
| `password`        | `String`  | yes      | Your password                                                                                                       |
| `sandbox`         | `Boolean` | no       | Define if is sandox or not.Default is `false`                                                                       |
| `autoLogin`       | `Boolean` | no       | Auto login to Epsilondigital and store jwt for next requests                                                        |
| `encoding`        | `String`  | no       | Encoding, default is `utf-8`                                                                                        |
| `timeout`         | `Integer` | no       | Define the request timeout                                                                                          |
| `axiosConfig`     | `Object`  | no       | Define the custom [Axios config](https://github.com/axios/axios#request-config), also override this library options |

## Methods

### POST

- `.post( data, endpoint )`
- `.post( data, endpoint, params )`

| Params     | Type     | Description                                                 |
| ---------- | -------- | ----------------------------------------------------------- |
| `data`     | `Object` | JS object to be converted into JSON and sent in the request |
| `endpoint` | `String` | Epsilondigital endpoint                                     |
| `params`   | `Object` | Query strings params                                        |

### LOGIN

- `.login(  params )`

| Params   | Type     | Description          |
| -------- | -------- | -------------------- |
| `params` | `Object` | Query strings params |

### REFRESH

- `.refresh(  params )`

| Params   | Type     | Description          |
| -------- | -------- | -------------------- |
| `params` | `Object` | Query strings params |

### CHECKTOKEN

- `.checkToken( endpoint )`

| Params     | Type     | Description                                                            |
| ---------- | -------- | ---------------------------------------------------------------------- |
| `endpoint` | `String` | Epsilondigital endpoint. If endpoint is login or refresh exit function |

## Example of use can see in test and test with

```js
yarn test
```

or

```js
npm test
```

## Release History

- 2024-09-19 - v1.0.0 - Initial release.
