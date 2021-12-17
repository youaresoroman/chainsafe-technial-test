# eth-ipfs-storage
App for storing IPFS content in Ethereum blockchain.

## Configuration

### node enviroment variables

Path: /.env

```
ETH_NETWORK= ethereum network provider Infura or Ganache
```

### Ethereum solidity contract source code

Path: /contracts/contract.sol

### Ethereum contract address

example: [ropsten network (0x23438910af7a62b2b9257f9fc222d590ceb95eb9)](https://ropsten.etherscan.io/address/0x23438910af7a62b2b9257f9fc222d590ceb95eb9)

## Installation

### Dependencies

```bash
npm install
```
### App installation (Linux)

```bash
npm run install:all
```
## Usage

### Help info

```bash
eth-ipfs-storage --help
```

### add content and set cid to Ethereum contract

```bash
eth-ipfs-storage set --file ./example/chainsafe.json --key <ethereum account private key>
```

### get cid from Ethereum contract

```bash
eth-ipfs-storage get --key <ethereum account private key>
```

## Credits

Thanks to you for this challenge!