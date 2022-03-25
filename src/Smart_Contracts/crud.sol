//SPDX-License-Identifier: UNLICENSED
pragma solidity^0.8.13;
contract crud {
    address public owner;
    struct Person {
        string name;
    }

    struct PersonWithId {
        uint id;
        string name;
    }

    uint nextId = 0;

    constructor() {
        owner = msg.sender;
    }

    mapping (address => Person) public persons;

    PersonWithId[] public personList;

    function addNameToList(string memory name) external {
        personList.push(PersonWithId(nextId,name));
        nextId ++;
    }

    function addNameToMap(string memory name) external {
        persons[msg.sender].name = name;

    }
    
}