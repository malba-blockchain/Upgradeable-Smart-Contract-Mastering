// scripts/upgrade_box.js

const {ethers, upgrades} = require('hardhat');

async function main () {
    const BoxV3 = await ethers.getContractFactory("BoxV3");
    console.log("Upgrading Box...");

    await upgrades.upgradeProxy("0x77dd7D71dcc6e071a47eefbeBcdb1Ad9b861f500", BoxV3);

    console.log("Box upgraded to V3");
}

main();