const { Wallet } = require("ethers");
const { ethers } = require("hardhat");

require('dotenv').config();

async function main() {

    const smartContractToDeploy = 'Box';

    // Connect to the custom JsonRpcProvider for PolygonAmoy
    const provider = new ethers.JsonRpcProvider(`https://polygon-amoy.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`);

    const wallet = new ethers.Wallet(process.env.REACT_APP_SIGNER_PRIVATE_KEY );

    const deployerWallet = wallet.connect(provider);

    console.log("\nDeployer wallet address: ", deployerWallet.address);

    console.log("\nDeployer wallet balance: ", await provider.getBalance(deployerWallet.address));

    console.log("\nCreating deployment transaction...");

    const smartContractFactory = await ethers.getContractFactory(smartContractToDeploy, deployerWallet);

    // Deploy the upgradeable contract proxy
    const txSmartContractDeployment = await upgrades.deployProxy(smartContractFactory, [42], { initializer: "store" });

    console.log("\nDeploying upgradeable smart contract...");

    // Manually build the transaction object
    const deploymentTransaction = {
        to: txSmartContractDeployment.target,
        gasLimit: 5000000,
        maxPriorityFeePerGas: ethers.parseUnits("20", "gwei"),
        maxFeePerGas: ethers.parseUnits("20", "gwei"),
        nonce: await provider.getTransactionCount(deployerWallet.address, "latest"),
        chainId: 80002
    };

    // Sign the transaction
    const signedTxSmartContractDeployment = await deployerWallet.signTransaction(deploymentTransaction);

    // Send the signed transaction
    const sendSignedTxSmartContractDeployment = await provider.broadcastTransaction(signedTxSmartContractDeployment);

    console.log("\nTransaction hash:", sendSignedTxSmartContractDeployment.hash);

    console.log("\nWait a minute for the transaction to be mined...");

    // Wait for the transaction to be mined
    const transactionReceipt = await sendSignedTxSmartContractDeployment.wait();

    console.log("Contract deployed at address:", transactionReceipt.contractAddress);

    const smartContractAbi = smartContractFactory.interface.formatJson();
    console.log("smartContractAbi", smartContractAbi);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });