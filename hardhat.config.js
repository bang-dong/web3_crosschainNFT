require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require("ethers");
require("hardhat-deploy-ethers");
require("hardhat-deploy")



/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
  version: "0.8.24",
  settings: {
    evmVersion: "cancun", // 必须包含这一行
    optimizer: {
      enabled: true,
      runs: 200
    }
   }
  },
  namedAccounts:{
    firstAccount:{
      default:0
    },
    secondAccount:{
      default:1
    },
  }
};
