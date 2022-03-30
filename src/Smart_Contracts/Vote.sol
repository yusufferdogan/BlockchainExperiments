// SPDX-License-Identifier: MIT
pragma solidity^0.8.12;

contract Ownable {
    address public owner;
    constructor(){
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract YusufToken is ERC20,Ownable {
    enum VoteStatus {UNINITIALIZED,ACCEPTED,REJECTED}
    uint256 private constant REJECT = 0;
    uint256 private constant ACCEPT = 1;
    uint256 private constant DAY = 86400;
    uint256 private constant MIN = 60;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 100 * 10**uint(decimals()));
    }

    struct Proposal {
        address creator;
        string name;
        string description;
        uint256 acceptedVotes;
        uint256 rejectedVotes;
        VoteStatus status;
        uint256 createdTime;
        uint deadlineAsDays;
    }

    Proposal[] public proposals;

    // callData isread only so its safer to use for this function
    function addProposal (string calldata name,string calldata description,uint256 deadlineAsDays) external {
        proposals.push(Proposal(msg.sender,name,description,0,0,VoteStatus.UNINITIALIZED,block.timestamp,deadlineAsDays));
    }

    function voteProposal (uint256 voteAs,uint256 amount,uint256 proposalId) external{
        require(proposalId >= 0 && proposalId < proposals.length,"Invalid proposalId");
        require(proposals[proposalId].status == VoteStatus.UNINITIALIZED,"Invalid proposalStatus");
        require(block.timestamp < (proposals[proposalId].createdTime +
         (proposals[proposalId].deadlineAsDays) * MIN),"PROPOSAL CLOSED TO VOTE");
        require(balanceOf(msg.sender) > amount,"You cant vote more than your balance");
        if(voteAs == REJECT) {
            proposals[proposalId].rejectedVotes += amount; 
            _burn(msg.sender, amount);
        }
        if(voteAs == ACCEPT){
            proposals[proposalId].acceptedVotes += amount; 
            _burn(msg.sender, amount);
        }
        else {
            revert("Invalid voteAs parameter it should be 1 for ACCEPT and 0 for REJECT");
        }
    }

    function finalizeProposal(uint256 proposalId) external{
        require(proposals[proposalId].status == VoteStatus.UNINITIALIZED,"Cant finalize finalized Proposal");

        if(proposals[proposalId].acceptedVotes > proposals[proposalId].rejectedVotes) {
            proposals[proposalId].status = VoteStatus.ACCEPTED;
        }
        else if(proposals[proposalId].acceptedVotes < proposals[proposalId].rejectedVotes) {
            proposals[proposalId].status = VoteStatus.REJECTED;
        }

        else {
            revert("SAME VOTE FOR ACCEPT AND REJECT PROPOSAL SUSPENDED");
        }
    }

    function isProposalAccepted(uint256 proposalId) external view returns (bool) {
        if(proposals[proposalId].status == VoteStatus.ACCEPTED) {
            return true;
        }
        else {
            return false;
        }
    }

}
