// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BoxV4 {
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

    // Multiply value stored by 2
    function multiply() public {
        _value = _value * 2;
        emit ValueChanged(_value);
    }

    // Power value stored by multiplying it by it same value
    function power() public {
        _value = _value * _value;
        emit ValueChanged(_value);
    }
}