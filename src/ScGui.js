import * as wAbi from "./withdraw_abi.js"
import * as deneme from "./deneme.js"
const submitButton = document.getElementById("SC_submit-btn");
const amountField = document.getElementById("SC_amount");
const destAddressField = document.getElementById("SC_destAddress");

const jsonInterface = JSON.parse(JSON.stringify(wAbi.myAbi()));
const contractAdress = "0xCF20821264320f62212DEdc1637d036651817d65";
// console.log(jsonInterface);

submitButton.addEventListener("click", function (e) {
    const destAdress = destAddressField.value;
    const amount = amountField.value;
	const contract = web3.eth.contract(jsonInterface,contractAdress);
	try {
		contract.methods.withdraw().send({
			amount: deneme.etherToWei(amount),
			destAddress : destAdress,
		}).then(function(e) {
			console.log(e)
		});
	}catch (e){
		console.log(e)
	}
    console.log("Dest Adress : " + destAdress);
    console.log("amount : " + amount);
});



