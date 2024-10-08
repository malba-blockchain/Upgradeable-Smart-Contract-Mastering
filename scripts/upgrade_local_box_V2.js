const {ethers, upgrades} = require('hardhat');

async function main () {
    const BoxV2 = await ethers.getContractFactory("BoxV2");
    console.log("Upgrading Box...");

    await upgrades.upgradeProxy("0x77dd7D71dcc6e071a47eefbeBcdb1Ad9b861f500", BoxV2);

    console.log("Box upgraded to V2");
}

main();

