const hre = require("hardhat");

const ACCOUNT_ADDR = "0xDCb35b258E81803644fdDCD5D6B930F9609321B0";
const poolAddress = "0x0562453c3DAFBB5e625483af58f4E6D668c44e19"
const aaveAbi = ["function depositETH(address,address,uint16) external payable"]

const infuraProvider = "https://sepolia.infura.io/v3/7c791cc83f3e40138f338042aeaeab8f"

async function main() {
  const account = await hre.ethers.getContractAt("Account", ACCOUNT_ADDR);
  const count = await account.count();
  console.log(count);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});