// This line imports the Wallet class from the ethers library.
// Wallets are used to sign transactions and interact with the blockchain.
const { Wallet } = require("ethers");

// This line imports the ethers library from hardhat.
// Hardhat is a popular development framework for Ethereum projects,
// and this line likely includes the `upgrades` module for deploying upgradeable contracts.
const { ethers } = require("hardhat");

// This line loads environment variables from a `.env` file using the dotenv library.
// Environment variables can be used to store sensitive information like API keys.
require('dotenv').config();

// This async function is the entry point of the script.
async function main() {

    // This line defines the name of the smart contract to be deployed.
    const smartContractToDeploy = 'Box';

    // This line creates a provider object to connect to the Polygon Amoy network using Alchemy.
    // A provider allows interaction with the blockchain, such as sending transactions.
    const provider = new ethers.JsonRpcProvider(`https://polygon-amoy.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`);

    // This line creates a wallet object using the private key stored in the REACT_APP_SIGNER_PRIVATE_KEY environment variable.
    const wallet = new ethers.Wallet(process.env.REACT_APP_SIGNER_PRIVATE_KEY);

    // This line connects the wallet to the provider, allowing it to sign transactions.
    const deployerWallet = wallet.connect(provider);

    // This line logs the address of the deployer wallet to the console.
    console.log("\nDeployer wallet address: ", deployerWallet.address);

    // This line gets the balance of the deployer wallet and logs it to the console.
    console.log("\nDeployer wallet balance: ", await provider.getBalance(deployerWallet.address));

    // This line logs a message indicating the creation of a deployment transaction.
    console.log("\nCreating deployment transaction...");

    // This line gets a contract factory object for the smart contract to be deployed.
    // A contract factory simplifies the process of deploying contracts.
    const smartContractFactory = await ethers.getContractFactory(smartContractToDeploy, deployerWallet);

    // This line deploys the upgradeable contract proxy using the `upgrades.deployProxy` function.
    // The function likely takes the contract factory, an array of constructor arguments (`[42]` in this case),
    // and an optional object with deployment configuration (`{ initializer: "store" }`).
    const txSmartContractDeployment = await upgrades.deployProxy(smartContractFactory, [42], { initializer: "store" });

    console.log("\nUpgradeable smart contract deployed: ", smartContractToDeploy);

    // This line logs the address of the deployed upgradeable contract proxy to the console.
    console.log("\nContract deployed at address: ", txSmartContractDeployment.target);

    // This line gets the ABI (Application Binary Interface) of the deployed smart contract.
    // The ABI defines how to interact with the contract's functions and events.
    const smartContractAbi = smartContractFactory.interface.formatJson();

    // This line creates a new contract object instance representing the deployed contract proxy.
    // It provides methods for interacting with the contract's functions and events.
    const smartContractInstance = await new ethers.Contract(txSmartContractDeployment.target, smartContractAbi, deployerWallet);

    // This line logs the address of the deployed contract proxy again (likely for verification).
    console.log("\nContract deployed at address: ", smartContractInstance.target);
}

// This line calls the `main` function and handles potential errors.
main()
    .then(() => process.exit(0))  // Exit with code 0 on successful execution
    .catch(error => {
        console.error(error);
        process.exit(1);             // Exit with code 1 on error
    });