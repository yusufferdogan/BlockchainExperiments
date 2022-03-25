// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract FeeCollector {
    address public owner;
    uint256 public balance;

    constructor() {
        owner = msg.sender;
    }

    receive() payable external {
        balance += msg.value;
    }

    function withdraw(uint amount , address payable destAddress) public{
        //require(msg.sender == owner , "Only owner can be withdraw");
        require(amount <= balance,"insufficient funds");
        destAddress.transfer(amount);
        balance -= amount;
    }
}