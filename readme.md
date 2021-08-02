### Blockchain Election DAPP

App simulates voting for two candidates. Each account can only vote once. There is an event after voting implemented which affects UI.

This repository is inspired by following tutorial:
https://www.youtube.com/watch?v=3681ZYbDSSk

## Dependencies

- Ganache https://www.trufflesuite.com/ganache
- Node JS
- Yarn

## Init project

### Install backend dependencies

```yarn install```

### Deploy contracts to blockchain

Run Ganache with Quickstart Workspace

```yarn deploy```

### Install frontend dependencies

```cd frontend```

```yarn install```

## Run project

```yarn serve```

### Init Metamask account

Login to Metamask

Go to Ganache and copy private key of first account

Open Metamask

Switch to Ganache Network

Click Import account

Paste private key

Connect Account

Open app on http://localhost:8080/

### Test Smart Contracts

```truffle test```