import * as Web3Lib from "../web3Lib.js"
import * as VoteAbi from "../abi/vote_abi.js"

if (typeof web3 !== 'undefined') {
    web3 = new Web3(window.ethereum);
} else {
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

// -----------------ACCOUNT DETAILS----------------------- 
const balanceOfTheAccountField = document.getElementById("balance")
//----------------------------------------------------

// -----------------GET PROPOSAL---------------------
const getProposalIdField = document.getElementById("get_proposal_id");
const getProposalButton = document.getElementById("get_proposal_button");
const proposalNameField = document.getElementById("proposal_name");
const proposalDescriptionField = document.getElementById("proposal_description");
const proposalAcceptedVotes = document.getElementById("accepted_votes");
const proposalRejectedVotes = document.getElementById("rejected_votes");

//----------------------------------------------------


// -----------------ADD PROPOSAL----------------------- 
const nameOfTheProposalField = document.getElementById("proposal_add_name")
const descriptionOfTheProposalField = document.getElementById("proposal_add_description")
const deadlineOfTheProposalField = document.getElementById("deadline")
const addVoteButtonField = document.getElementById("add_proposal_button")
//----------------------------------------------------


// -----------------VOTE PROPOSAL----------------------- 
const amountOfTheVoteField = document.getElementById("vote_amount")
const idOfTheProposalField = document.getElementById("proposal_id")
const voteAsProposalField = document.getElementById("proposal_vote_as")

const voteProposalButtonField = document.getElementById("vote_proposal_button")
//----------------------------------------------------


const jsonInterface = JSON.parse(JSON.stringify(VoteAbi.myAbi()));
const contractAddress = "0xE91E28288ab1841B79Ba70642709224477E9dA2E";
const contract = new web3.eth.Contract(jsonInterface, contractAddress);

getProposalButton.addEventListener("click", async function (e) {
    getProposal();
    showAccountDetails();
})

addVoteButtonField.addEventListener("click", async function (e) {
    addProposal();
    showAccountDetails();
})

voteProposalButtonField.addEventListener("click", async function (e) {
    vote();
    showAccountDetails();
})



window.onload = showAccountDetails

async function showAccountDetails() {
    await getBalance();
}

async function getBalance() {
    const userAccount = await Web3Lib.getAccount();
    await contract.methods.balanceOf(userAccount).call(
        { from: userAccount }, async function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                balanceOfTheAccountField.innerHTML = Web3Lib.divideByTenToSix(result)
            }
        }
    );
}

async function vote() {
    const userAccount = await Web3Lib.getAccount();
    const amountOfTheVote = amountOfTheVoteField.value
    const idOfTheProposal = idOfTheProposalField.value
    const voteAs = voteAsProposalField.value;
    await contract.methods.voteProposal(voteAs,Web3Lib.multiplyWithTenToSix(amountOfTheVote),idOfTheProposal).send(
        { from: userAccount }, async function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                // amountOfTheVoteField.innerHTML = 
            }
        }
    );
}

async function addProposal() {
    const name = nameOfTheProposalField.value;
    const description = descriptionOfTheProposalField.value;
    const deadline = deadlineOfTheProposalField.value;
    const userAccount = await Web3Lib.getAccount();
    await contract.methods.addProposal(name, description, deadline).send(
        { from: userAccount }, async function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(result)
            }
        }
    );
}

async function getProposal() {
    const userAccount = await Web3Lib.getAccount();
    const getProposalId = getProposalIdField.value;
    await contract.methods.proposals(getProposalId).call(
        { from: userAccount }, async function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                proposalNameField.innerHTML = result.name;
                proposalDescriptionField.innerHTML = result.description;
                proposalAcceptedVotes.innerHTML = Web3Lib.divideByTenToSix(result.acceptedVotes);
                proposalRejectedVotes.innerHTML = Web3Lib.divideByTenToSix(result.rejectedVotes);
            }
        }
    );

}