const { ethers } = require("hardhat");


const FACTORY_NONCE = 1;
const FACTORY_ADDRESS = "0x69819148AF5B2d4396C7a5Ce054D9B5a45c79c87"
const EP_ADDRESS = "0xe1583AdB88E098924eF93fa04f60DF04D5658615"
const PM_ADDRESS = "0x149a050459639d6233C7e4D0425fE61aFdaB8259"

const aaveAddress = "0x387d311e47e80b498169e6fb51d3193167d89F7D"
const aaveAbi = ["function depositETH(address,address,uint16) external payable"]

const infuraProvider = "https://sepolia.infura.io/v3/7c791cc83f3e40138f338042aeaeab8f"

async function main() {
    
    const [signer0] = await ethers.getSigners()
    const address0 = signer0.address;
    const provider = new ethers.JsonRpcProvider(infuraProvider);
    const aaveContract = new ethers.Contract(aaveAddress, aaveAbi, provider);

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

    const userOp = {
        sender,
        nonce: await entryPoint.getNonce(sender, 0),
        initCode,
        callData: aaveContract.interface.encodeFunctionData("depositETH", [
            '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
            sender,
            ethers.parseEther("0.0000000000000001")
        ]),
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