// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }
    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

contract Faucet is ReentrancyGuard{

    address public owner;
    uint256 public balance;

    mapping (address => uint) public withdraws; 

    constructor() {
        owner = msg.sender;
    }

    receive() payable external {
        balance += msg.value;
    }

    // use external to save gas when function never called by contract itself
    function withdraw(uint amount) external nonReentrant{
        address payable destAddress = payable(msg.sender);
        require(destAddress != address(0),"Address can't be null");
        require(amount <= balance,"insufficient funds");
        balance = balance - amount;
        withdraws[msg.sender] += amount; 
        destAddress.transfer(amount);
    }
}