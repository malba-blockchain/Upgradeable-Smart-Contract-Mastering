require('dotenv').config();

const { ethers } = require("hardhat");

const { PROXY_ADMIN_CONTRACT_ADDRESS } = require('../utils/addresses.ts');

const { PROXY_ADMIN_ABI } = require('../utils/abi.ts');

async function getSigner() {
    const signers = await ethers.getSigners();
    return signers[0]; // Use the first signer
}

// Call the function
async function callFunction() {
    // Connect to Alchemy provider
    const provider = new ethers.JsonRpcProvider(`https://polygon-amoy.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`); // Replace with your Alchemy API key

    const signerWallet = await getSigner();
    console.log("\nSignerWallet");
    console.log(signerWallet);

    // Connect the signer to the provider
    const connectedSigner = signerWallet.connect(provider);
    console.log("\nConnectedSigner");
    console.log(connectedSigner);
    
    // Replace with your contract address and ABI
    const contractAddress = PROXY_ADMIN_CONTRACT_ADDRESS;
    const abi = PROXY_ADMIN_ABI;
    console.log("\nContractAddress");
    console.log(contractAddress);
    console.log("\nAbi");
    console.log(abi);

    // Create a smartContract instance
    const smartContract = new ethers.Contract(contractAddress, abi, connectedSigner);

    console.log("\nCalling function...");

    try {
        // Define the function parameters
        const param1 = "0x498C47066AdeB22Ba23953d890eD6b540411e350"; // Replace with your new owner address

        // Define the transaction object
        const transaction = {
            to: contractAddress,
            data: smartContract.interface.encodeFunctionData("transferOwnership", [param1]),
            gasLimit: 5000000,
            nonce: await provider.getTransactionCount(signerWallet.address, "latest"),
            chainId: 80002 // Replace with the chain ID of PolygonAmoy 
        };

        // Sign the transaction
        const signedTransaction = await signerWallet.signTransaction(transaction);

        // Send the signed transaction
        const txResponse = await provider.sendTransaction(signedTransaction);

        console.log("Transaction submitted:", txResponse.hash);

        // Wait for the transaction to be confirmed
        const receipt = await txResponse.wait();

        console.log("Transaction confirmed:", receipt);
    } catch (error) {
        console.error("Error calling function:", error);
    }
}

// Execute the function call
callFunction();