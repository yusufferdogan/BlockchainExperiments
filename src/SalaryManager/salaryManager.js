import * as SalaryManagerAbi from "../abi/salaryManagerAbi.js"
import * as UsdtAbi from "../abi/usdt_abi.js"
import * as Web3Lib from "../web3Lib.js"

if (typeof web3 !== 'undefined') {
    web3 = new Web3(window.ethereum);
} else {
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

//*****************************************************************************
const addresses = []
const amounts = []
//*****************************************************************************
const jsonInterface = JSON.parse(JSON.stringify(SalaryManagerAbi.myAbi()));
const contractAddress = "0xa93C73c5F9b4f53352dd1d61B377a0d6d1820d20";
const contract = new web3.eth.Contract(jsonInterface, contractAddress);
//*****************************************************************************
const usdtJsonInterface = JSON.parse(JSON.stringify(UsdtAbi.myAbi()));
const usdtContractAddress = "0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02";
const usdtContract = new web3.eth.Contract(usdtJsonInterface, usdtContractAddress);


const button = document.getElementById("submit_button");
button.addEventListener("click", async function (e) {
    const userAccount = await Web3Lib.getAccount();
    manipulateString()
    const UserAllowance = Web3Lib.weiToEther(await allowance(userAccount));
    console.log("UserAllowance: ", UserAllowance)
    if(UserAllowance < getTotal()){
        await approve(userAccount,500);
    }
    await pay(userAccount);
    addresses.length = 0
    amounts.length = 0
})

const AddressField = document.getElementById("salary_address")
const ValueField = document.getElementById("salary_value")


async function pay(userAccount){
    await contract.methods.pay(addresses,getAmounts(),getTotal()).send(
        { from: userAccount }, async function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(result);
            }
        }
    ); 
}

async function allowance(userAccount){
    return await usdtContract.methods.allowance(userAccount,contractAddress).call(
        { from: userAccount }
    );
}

async function getUsdtBalance(userAccount){
    await usdtContract.methods.balanceOf(userAccount).call(
        { from: userAccount }, async function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("balanceOf: " + Web3Lib.weiToEther(result))
            }
        }
    );
}

async function approve(userAccount,amount){
    await usdtContract.methods.approve(contractAddress,Web3Lib.etherToWei(amount)).send(
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

function manipulateString(){
    const inputAddresses = AddressField.value.trim().split('\n')
    const inputValues = ValueField.value.trim().split('\n')
    if(inputAddresses.length != inputValues.length){
        alert("addresses length and values length must match")
        return;    
    }
    for (let i = 0; i < inputAddresses.length; i++){
        addresses.push(inputAddresses[i].trim())
        amounts.push(parseInt(inputValues[i].trim()))
    }
    console.log(addresses)
    console.log(amounts)
}

function getAmounts(){
    return amounts.map(amount => Web3Lib.etherToWei(amount));
}

function getTotal(){
    const total = amounts.reduce((a, b) => a + b, 0)
    return Web3Lib.etherToWei(total);
}