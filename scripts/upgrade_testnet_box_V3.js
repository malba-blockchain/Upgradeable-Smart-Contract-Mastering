const { ethers, upgrades } = require('hardhat'); // Import ethers and upgrades from the Hardhat framework

require('dotenv').config(); // Load environment variables from a .env file

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time)); // Define a sleep function that returns a promise to pause execution for a specified time
}

async function main() {

    const smartContractToUpgradeWith = 'BoxV3'; // Define the new version of the smart contract to upgrade with

    const proxySmartContractAddress = '0x7c14adc7e38baf706157906c9c649b422e698405'; // Define the address of the proxy smart contract
    
    // Connect to the custom JsonRpcProvider for PolygonAmoy using Alchemy API
    const provider = new ethers.JsonRpcProvider(`https://polygon-amoy.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`);

    const wallet = new ethers.Wallet(process.env.REACT_APP_SIGNER_PRIVATE_KEY); // Create a wallet instance using the private key from .env

    const deployerWallet = wallet.connect(provider); // Connect the wallet to the provider

    console.log("\nDeployer wallet address: ", deployerWallet.address); // Log the deployer wallet's address

    console.log("\nDeployer wallet balance: ", await provider.getBalance(deployerWallet.address)); // Log the deployer wallet's balance

    console.log("\nCreating upgrade transaction..."); // Log that the upgrade transaction is being created

    // Get a contract factory for the smart contract to upgrade with, connected with the deployer's wallet
    const smartContractFactory = await ethers.getContractFactory(smartContractToUpgradeWith, deployerWallet);

    // Deploy the upgradeable contract proxy
    const txSmartContractUpgrade = await upgrades.upgradeProxy(proxySmartContractAddress, smartContractFactory);

    await sleep(10000); // Pause execution for 10 seconds to wait for the transaction to propagate

    const transactionHash = txSmartContractUpgrade.deployTransaction.hash; // Get the transaction hash of the upgrade

    const receipt = await provider.getTransactionReceipt(transactionHash); // Get the transaction receipt using the hash

    const rawAddress = receipt.logs[0].topics[1]; // Extract the raw address from the first log topic in the receipt

    console.log("\nNew smart contract to upgrade with: ", smartContractToUpgradeWith); // Log the name of the new smart contract version

    // Convert the raw address to a valid Ethereum address by slicing the last 40 characters and formatting it
    const smartContractAddress = ethers.getAddress('0x' + rawAddress.slice(-40));

    console.log("\nNew implementation address: ", smartContractAddress); // Log the new implementation contract address

    // Get the ABI of the upgraded smart contract
    const smartContractAbi = smartContractFactory.interface.formatJson();

    // Create a contract instance with the proxy address, ABI, and deployer wallet
    const smartContractInstance = await new ethers.Contract(proxySmartContractAddress, smartContractAbi, deployerWallet);

    console.log("\nSmart contract proxy address ", smartContractInstance.target); // Log the target address of the smart contract instance
}

main()
    .then(() => process.exit(0)) // Exit the process with code 0 (success) if the script runs successfully
    .catch(error => { // Catch any errors that occur during execution
        console.error(error); // Log the error
        process.exit(1); // Exit the process with code 1 (failure)
    });
