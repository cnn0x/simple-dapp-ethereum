In this Web 3.0 project, I created a simple dapp that runs on Ethereum blockchain. The dapp was deployed on Rinkeby testnet with hardhat. Smart Contract was written in Solidity. In the front-end, I used React and to connect to the blockchain I used Ethers.js which is an alternative to Web3.js. Metamask is the provider in this dapp. After connecting your wallet with Metamask, you enter a message which will be stored in the blockchain, hitting the wave button is going to trigger Metamask to confirm your transaction. If you refresh the page after your transaction was mined, you will see your message which was fetched from the blockchain. You will also see other messages that were sent by other wallets.

# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
