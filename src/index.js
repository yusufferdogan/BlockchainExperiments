import * as deneme from "./deneme.js"
import * as FaucetAbi from "./abi/faucet_abi.js"

// Checking if Web3 has been injected by the browser (Mist/MetaMask)
if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    // window.web3 = new Web3(web3.currentProvider);
    web3 = new Web3(window.ethereum);

} else {
    //If you click "ok" you would be redirected . Cancel will load this website
    if (window.confirm('Please install Metamask')) {
        window.location.href = 'https://metamask.io/download/';
    };
    console.log('No web3? You should consider trying MetaMask!')
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

const TxObject = {
    sender: "",
    receiver: "",
    balance: "",
    gas: "",
    receipt: "",
    gasPrice: "",
}

const contractAdress = "0x13FCe3cA4188B890e4ADA96807253409eE80147A";
const jsonInterface = JSON.parse(JSON.stringify(FaucetAbi.FaucetAbi()));
const contract = new web3.eth.Contract(jsonInterface, contractAdress);

const submit_button = document.getElementById('submit-btn');
const amountField = document.getElementById("Faucet-amount");
const addressField = document.getElementById("Faucet-recieverAdress");


submit_button.addEventListener('click', async function (e) {
    TxObject.receiver = addressField.value;
    addElement(addressField)

    TxObject.sender = await deneme.getAccount()
    TxObject.balance = await deneme.getAccountBalance(TxObject.sender)

    deneme.estimateGas(TxObject.sender, TxObject.receiver).then(function (gas) {
        TxObject.gas = gas
        // alert("estimated gas is: " + String(gas));
    })

    await sendTokenFromSc();

    TxObject.gasPrice = await deneme.getGasPrice();
    console.log("Gas Price is : " + deneme.weiToEther(TxObject.gasPrice))
    console.log(TxObject)
})

function addElement(adress) {
    const transactions = document.getElementById('transactions');
    const transaction = document.createElement("div");
    transaction.innerHTML =  amountField.value + " ether has sended to " + adress.value
    transactions.appendChild(transaction);
}

const metamaskButton = document.getElementById("enableMetamask");
const showAccount = document.getElementById("showAccount");
metamaskButton.addEventListener("click", function (e) {
    showAccountDetails();
})

async function showAccountDetails() {
    const account = await deneme.getAccount();
    const balance = await deneme.getAccountBalance(account);
    const balanceAsEther = deneme.weiToEther(balance);

    showBalance.innerHTML = balanceAsEther;
    showAccount.innerHTML = account;

}
window.onload = showAccountDetails

async function sendTokenFromSc(){

    const destAdress = addressField.value;
    const amount = amountField.value;
    try {
        const currentAccount = await deneme.getAccount();
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
            }
        })
    } catch (e) {
        console.log(e)
    }
    console.log("Dest Adress : " + destAdress);
    console.log("amount : " + amount);
    
}