require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "localhost",
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-sepolia.g.alchemy.com/v2/ecgQUDe31vzByY9p8plsoFHT0ID6K2oO",
      }
    },
  },
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
