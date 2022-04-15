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
const contractAddress = "0xB390a772D89078e529ec3E8510f39455D4d5af97";
const contract = new web3.eth.Contract(jsonInterface, contractAddress);
//*****************************************************************************
const usdtJsonInterface = JSON.parse(JSON.stringify(UsdtAbi.myAbi()));
const usdtContractAddress = "0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02";
const usdtContract = new web3.eth.Contract(usdtJsonInterface, usdtContractAddress);


const button = document.getElementById("submit_button");
button.addEventListener("click", async function (e) {
    const userAccount = await Web3Lib.getAccount();
    await pay(userAccount);
})

const approveButton = document.getElementById("approve_button");
const InputField = document.getElementById("salary")
approveButton.addEventListener("click", async function (e) {
    const userAccount = await Web3Lib.getAccount();
    manipulateString()
    await allowance(userAccount);
    await approve(userAccount);
    addresses.length = 0;
    amounts.length = 0;
})

async function pay(userAccount){
    await contract.methods.payUsdt(usdtContractAddress,addresses,getAmounts()).send(
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
    await usdtContract.methods.allowance(userAccount,contractAddress).call(
        { from: userAccount }, async function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("allowance is :" + Web3Lib.weiToEther(result))
            }
        }
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

async function approve(userAccount){
    await usdtContract.methods.approve(contractAddress,getTotal()).send(
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
    const text = InputField.value;
    const lines = text.trim().split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim().split(",")
        addresses.push(line[0].trim())
        amounts.push(parseInt(line[1].trim()))
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