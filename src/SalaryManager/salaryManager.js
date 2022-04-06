import * as SalaryManagerAbi from "../abi/salaryManagerAbi.js"
import * as UsdtAbi from "../abi/usdt_abi.js"

import * as Web3Lib from "../web3Lib.js"

if (typeof web3 !== 'undefined') {
    web3 = new Web3(window.ethereum);
} else {
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

const addresses = ["0xc7115557e58EeD59471c5BE7748eF284938B4a5d","0x444DE5308e5AfB65CC6000cAaaCFc9800a1Df493"]
const amounts = [Web3Lib.etherToWei(20) ,Web3Lib.etherToWei(20)]
const total = amounts.reduce((a, b) => a + b, 0)
const button = document.getElementById("submit_button");


const jsonInterface = JSON.parse(JSON.stringify(SalaryManagerAbi.myAbi()));
const contractAddress = "0x7f6dbc21480b85fa6f4b7ba1db5de464534e8d7b";
const contract = new web3.eth.Contract(jsonInterface, contractAddress);

const usdtJsonInterface = JSON.parse(JSON.stringify(UsdtAbi.myAbi()));
const usdtContractAddress = "0x77c24f0Af71257C0ee26e0E0a108F940D1698d53";
const usdtContract = new web3.eth.Contract(usdtJsonInterface, usdtContractAddress);


button.addEventListener("click", async function (e) {
    const userAccount = await Web3Lib.getAccount();
    await usdtContract.methods.approve(userAccount,total).send(
        { from: userAccount }, async function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                // balanceOfTheAccountField.innerHTML = Web3Lib.divideByTenToSix(result)
            }
        }
    );
    await contract.methods.pay(usdtContractAddress,addresses,amounts).send(
        { from: userAccount }, async function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                // balanceOfTheAccountField.innerHTML = Web3Lib.divideByTenToSix(result)
            }
        }
    ); 

})