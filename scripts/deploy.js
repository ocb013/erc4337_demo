const { ethers } = require("hardhat");

let acc1, acc2

async function main() {
    [acc1, acc2] = await ethers.getSigners();

    let EntryPoint = await ethers.getContractFactory("EntryPoint")
    let entryPoint = await EntryPoint.deploy({
        gasPrice: ethers.parseUnits('50', 'gwei'), // Adjust the gas price as needed
    })
    await entryPoint.waitForDeployment()
    console.log("EntryPoint address:", await entryPoint.target)

    let AccountFactory = await ethers.getContractFactory("AccountFactory")
    let accountFactory = await AccountFactory.deploy({
        gasPrice: ethers.parseUnits('50', 'gwei'), // Adjust the gas price as needed
    })
    await accountFactory.waitForDeployment()
    console.log("AccountFactory address:", await accountFactory.target)

    let Paymaster = await ethers.getContractFactory("Paymaster")
    let paymaster = await Paymaster.deploy({
        gasPrice: ethers.parseUnits('50', 'gwei'), // Adjust the gas price as needed
    })
    await paymaster.waitForDeployment()
    console.log("Paymaster address:", await paymaster.target)

}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1;
})