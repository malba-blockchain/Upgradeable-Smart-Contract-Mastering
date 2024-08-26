// scripts/index.js
async function main () {
    // Retrieve accounts from the local node
    const provider = new ethers.JsonRpcProvider();
    const accounts = await provider.listAccounts();
    //console.log(accounts);

    /*
    An ethers contract instance is a JavaScript object that represents 
    our contract on the blockchain, which we can use to interact 
    with our contract. To attach it to our deployed contract we need 
    to provide the contract address.
    */
    const address = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    const Box = await ethers.getContractFactory('Box');
    const box = Box.attach(address);

    // Call the retrieve() function of the deployed Box contract
    const value = await box.retrieve();
    console.log('\nBox value is', value.toString());

    // Send a transaction to store() a new value in the Box
    await box.store(23);

    // Call the retrieve() function of the deployed Box contract
    const value2 = await box.retrieve();
    console.log('\nBox value is', value2.toString());


  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });