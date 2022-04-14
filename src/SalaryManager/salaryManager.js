import * as SalaryManagerAbi from "../abi/salaryManagerAbi.js"
import * as UsdtAbi from "../abi/usdt_abi.js"

import * as Web3Lib from "../web3Lib.js"

if (typeof web3 !== 'undefined') {
    web3 = new Web3(window.ethereum);
} else {
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

//*****************************************************************************
const addresses = ["0xc7115557e58EeD59471c5BE7748eF284938B4a5d","0x07147406D726df8C84576d07011a6B14894dD6bD"]
const amounts = [300 , 200]
const amountsAsWei = amounts.map(amount => Web3Lib.etherToWei(amount))
const total = amounts.reduce((a, b) => a + b, 0)
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
    await allowance(userAccount);
    await approve(userAccount);
    await pay(userAccount);
    await allowance(userAccount);
})

async function pay(userAccount){
    await contract.methods.payUsdt(usdtContractAddress,addresses,amountsAsWei).send(
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
    await usdtContract.methods.approve(contractAddress,Web3Lib.etherToWei(total)).send(
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