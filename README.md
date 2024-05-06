## Arbitrum Gateway

Targets L2 verification on Arbitrum with the implementation of `ArbProofService`, which fetches data and proofs from Arbitrum.

`ArbProofService` is invoked by hitting the `/resolve` endpoint. Clients calling the endpoint are expected to implement the CCIP protocol, and pass the L1 contract address to the endpoint, along with the calldata returned by the L1 contract.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
