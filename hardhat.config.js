//hardhat.config.js
require("@nomicfoundation/hardhat-ethers");
require('@openzeppelin/hardhat-upgrades');
require("@nomicfoundation/hardhat-verify");
require('dotenv').config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    polygonAmoy: {
      url: `https://polygon-amoy.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`,
      accounts: { mnemonic: process.env.REACT_APP_MNEMONIC },
    },
  },
   // configuration for harhdat-verify plugin
  etherscan: {
    apiKey: {
      polygonAmoy: process.env.REACT_APP_ETHERSCAN_API_KEY
    },
    customChains: [
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",  // Replace with the actual API URL
          browserURL: "https://amoy.polygonscan.com"  // Replace with the actual browser URL
        }
      }
    ]
  },
  // configuration for etherscan-verify from hardhat-deploy plugin
  verify: {
    etherscan: {
      apiKey: process.env.REACT_APP_ETHERSCAN_API_KEY,
    },
  },
  sourcify: {
    enabled: false,
  },
};

