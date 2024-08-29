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

    const txSmartContractDeployment = await smartContractFactory.getDeployTransaction();

    txSmartContractDeployment.to = null; // Deploying a new contract, not sending to an address
    txSmartContractDeployment.value = ethers.parseEther("0"); // No Ether transfer
    txSmartContractDeployment.gasLimit = 5000000;
    txSmartContractDeployment.maxPriorityFeePerGas = ethers.parseUnits("15", "gwei");
    txSmartContractDeployment.maxFeePerGas = ethers.parseUnits("20", "gwei");
    txSmartContractDeployment.nonce = await provider.getTransactionCount(deployerWallet.address, "latest"),
    txSmartContractDeployment.type = 2;
    txSmartContractDeployment.chainId = 80002;

    const signedTxSmartContractDeployment = await deployerWallet.signTransaction(txSmartContractDeployment);

    console.log("\nDeploying smart contract...");

    const sendSignedTxSmartContractDeployment = await provider.broadcastTransaction(signedTxSmartContractDeployment);

    console.log("\nTransaction hash:", sendSignedTxSmartContractDeployment.hash);

    console.log("\nWait a minute for the transaction to be mined...");

    // Wait for the transaction to be mined
    const transactionReceipt = await sendSignedTxSmartContractDeployment.wait();

    console.log("Contract deployed at address:", transactionReceipt.contractAddress);

    const smartContractAbi = smartContractFactory.interface.formatJson();

    console.log("smartContractAbi", smartContractAbi);

    const smartContractInstance = await new ethers.Contract(transactionReceipt.contractAddress, smartContractAbi, deployerWallet);
    
    console.log("Contract deployed at address:", smartContractInstance.target);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });