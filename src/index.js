import * as deneme from "./deneme.js"

// Checking if Web3 has been injected by the browser (Mist/MetaMask)
if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    // window.web3 = new Web3(web3.currentProvider);
    web3 = new Web3(window.ethereum);

} else {
    //If you click "ok" you would be redirected . Cancel will load this website
    if (window.confirm('Install Metamask')) {
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

const submit_button = document.getElementById('submit-btn');
submit_button.addEventListener('click', async function (e) {
    const adress = document.getElementById("recieverAdress").value;
    TxObject.receiver = adress;
    addElement(adress)

    TxObject.sender = await deneme.getAccount()
    TxObject.balance = await deneme.getAccountBalance(TxObject.sender)

    deneme.estimateGas(TxObject.sender, TxObject.receiver).then(function (gas) {
        TxObject.gas = gas
        alert("estimated gas is: " + String(gas));
    })

    deneme.sendTransaction(TxObject.sender, adress, String(deneme.etherToWei("0.01"))).
    then(function (receipt) {
        TxObject.receipt = receipt;
        console.log(receipt.toString());
    });

    TxObject.gasPrice = await deneme.getGasPrice();
    alert("Gas Price is : " + deneme.weiToEther(TxObject.gasPrice))
    alert("Gas fee is :" + String(deneme.weiToEther(TxObject.gas * TxObject.gasPrice)))
    console.log("Gas Price is : " + deneme.weiToEther(TxObject.gasPrice))
    console.log(TxObject)
})

function addElement(adress) {
    const transactions = document.getElementById('transactions');
    const transaction = document.createElement("div");
    transaction.innerHTML = "0.05 Ether has sended to " + adress
    transactions.appendChild(transaction);
}

const metamaskButton = document.getElementById("enableMetamask");
const showAccount = document.getElementById("showAccount");
metamaskButton.addEventListener("click", function (e) {
    // getWallet();
    // unlockWallet();
    showAccountDetails();
})

async function showAccountDetails() {
    const account = await deneme.getAccount();
    const balance = await deneme.getAccountBalance(account);
    const balanceAsEther = deneme.weiToEther(balance);

    showBalance.innerHTML = balanceAsEther;
    showAccount.innerHTML = account;

}
