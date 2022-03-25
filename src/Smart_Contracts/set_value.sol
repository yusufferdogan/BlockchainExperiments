//SPDX-License-Identifier: UNLICENSED
pragma solidity^0.8.13;

contract SetValue{
    address public owner;
    uint256 public value;

    constructor() { // constructor nasıl run edilir 
        owner = msg.sender;
    }

    function setValue(uint256 _value) external{
        value = _value;
    }

}