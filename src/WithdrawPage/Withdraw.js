import * as wAbi from "../abi/withdraw_abi.js"
import * as deneme from "../deneme.js"

if (typeof web3 !== 'undefined') {
    web3 = new Web3(window.ethereum);
} else {
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

const submitButton = document.getElementById("SC_submit-btn");
const amountField = document.getElementById("SC_amount");
const destAddressField = document.getElementById("SC_destAddress");

const jsonInterface = JSON.parse(JSON.stringify(wAbi.myAbi()));
const contractAdress = "0xCF20821264320f62212DEdc1637d036651817d65";

//console.log(jsonInterface);
//contract.methods.withdraw(ilkparam, ikinciparam).send({from: selectedAddress})
const contract = new web3.eth.Contract(jsonInterface, contractAdress);
submitButton.addEventListener("click", async function (e) {
    const txHashElement = document.getElementById("tx_hash");
    const txDetailsElement = document.getElementById("tx_details");

    const destAdress = destAddressField.value;
    const amount = amountField.value;
    try {
        const currentAccount = await deneme.getAccount();
        web3.eth.getBalance(destAdress).then(console.log);
        const receipt = await contract.methods.withdraw(
            deneme.etherToWei(amount),
            destAdress.toLowerCase()
        ).send({
            from: currentAccount
        }, async function (err, res) {
            if (err) {
                console.log("an error occured" + err);
            } else {
                const tx = await web3.eth.getTransaction(res)
                txDetailsElement.innerHTML = 
                `from : ${tx.from} \n to: ${tx.to} \n value : ${tx.value} \n `
                console.log("Transaction Hash:" + res)
                txHashElement.innerHTML = "Transaction Hash:" + res
            }
        })
    } catch (e) {
        console.log(e)
    }
    console.log("Dest Adress : " + destAdress);
    console.log("amount : " + amount);
});

window.onload = showInfo
async function showInfo() {
	const contractBalanceElement = document.getElementById("contract_balance")
	const contractOwnerElement = document.getElementById("contract_owner")
	const contractOwner = await contract.methods.owner().call(); 
	const contractBalance = await contract.methods.balance().call();
	contractBalanceElement.innerHTML = deneme.weiToEther(contractBalance)
	contractOwnerElement.innerHTML = contractOwner

}
