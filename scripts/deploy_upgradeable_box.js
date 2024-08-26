const {ethers, upgrades} = require('hardhat');

async function main (){
    const Box = await ethers.getContractFactory('Box');
    console.log("Deploying Box...");
    
    //Key difference is in this deployment
    const box = await upgrades.deployProxy(Box, [42], {initializer: 'store'});
    
    await box.waitForDeployment();
    console.log("\nBox deployed to: ", box.target);
}

main();