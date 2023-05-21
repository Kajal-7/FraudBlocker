
require('@nomicfoundation/hardhat-toolbox')
require('dotenv').config()
// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key

const INFURA_API_KEY = process.env.INFURA_API_KEY;

// Replace this private key with your Goerli account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;


module.exports = {
  solidity: '0.8.17',
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
     
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
}
