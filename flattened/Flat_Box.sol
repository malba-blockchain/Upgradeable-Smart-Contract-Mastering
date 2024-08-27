// Sources flattened with hardhat v2.22.9 https://hardhat.org

// SPDX-License-Identifier: MIT

// File contracts/Box.sol

// contracts/Box.sol
// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.20;

contract Box {
    uint256 private _value;

    // Emitted when the stored value changes
    event ValueChanged(uint256 value);

    // Stores a new value in the contract
    function store(uint256 value) public {
        _value = value;
        emit ValueChanged(value);
    }

    // Reads the last stored value
    function retrieve() public view returns (uint256) {
        return _value;
    }
}
