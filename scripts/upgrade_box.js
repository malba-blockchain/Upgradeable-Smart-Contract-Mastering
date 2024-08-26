// scripts/upgrade_box.js

const {ethers, upgrades} = require('hardhat');

async function main () {
    const BoxV2 = await ethers.getContractFactory("BoxV2");
    console.log("Upgrading Box...");

    await upgrades.upgradeProxy("0xa513E6E4b8f2a923D98304ec87F64353C4D5C853", BoxV2);

    console.log("Box upgraded");
}

main();