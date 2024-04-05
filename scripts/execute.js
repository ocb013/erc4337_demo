const { ethers } = require("hardhat");


const FACTORY_NONCE = 1;
const FACTORY_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
const EP_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const PM_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"

async function main() {
    
    const [signer0] = await ethers.getSigners()
    const address0 = signer0.address;

    const entryPoint = await ethers.getContractAt("EntryPoint", EP_ADDRESS)

    const sender = await ethers.getCreateAddress({
        from: FACTORY_ADDRESS,
        nonce: FACTORY_NONCE
    })
    console.log({ sender })
    const AccountFactory = await ethers.getContractFactory("AccountFactory")
    const initCode = //"0x"
    FACTORY_ADDRESS + AccountFactory.interface.encodeFunctionData("createAccount", [address0]).slice(2);

    await entryPoint.depositTo(PM_ADDRESS, {
        value: ethers.parseEther('100'),
    })

    const Account = await ethers.getContractFactory("Account")
    const userOp = {
        sender,
        nonce: await entryPoint.getNonce(sender, 0),
        initCode,
        callData: Account.interface.encodeFunctionData("execute"),
        callGasLimit: 400_200,
        verificationGasLimit: 400_200,
        preVerificationGas: 100_000,
        maxFeePerGas: ethers.parseUnits('10', 'gwei'),
        maxPriorityFeePerGas: ethers.parseUnits('5', 'gwei'),
        paymasterAndData: PM_ADDRESS,
        signature: "0x"
    }

    const userOpHash = await entryPoint.getUserOpHash(userOp)
    userOp.signature = signer0.signMessage(ethers.getBytes(userOpHash))

    const tx = await entryPoint.handleOps([userOp], address0)
    const receipt = await tx.wait()
    console.log(receipt)

}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1;
})