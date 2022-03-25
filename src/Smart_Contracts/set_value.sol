//SPDX-License-Identifier: UNLICENSED
pragma solidity^0.8.13;

contract SetValue{
    address public owner;
    uint256 public value;
    bytes public data;
    uint public gas;
    bytes4 public sig;
    uint public MsgValue;

    constructor(uint256 initialValue) { // constructor nasıl run edilir 
        value = initialValue;
        owner = msg.sender; //sender of the message (current call)
        //sig = msg.sig; // must be payable 
        //MsgValue = msg.value; // number of wei sent with the message
    }

    function setValue(uint256 _value) external{
        data = msg.data;
        gas = gasleft(); //remaining gas 
        value = _value;
    }

}