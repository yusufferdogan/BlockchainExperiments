
let userAccount;
const MAX_INT = 2**256 - 1
//*****************************************************************************
const addresses = [];
const amounts = [];
//*****************************************************************************
const contractAddress = "TUW9oZRveEzmZt3wNcknwopGZSLe6XG4Q4";
const tokenAddress = "TMyaqq4XJ27dPDhjrMfdkk4GH9nfsui7aT";
//*****************************************************************************
const AddressField = document.getElementById("salary_address");
const ValueField = document.getElementById("salary_value");
//*****************************************************************************

const button = document.getElementById("submit_button");
button.addEventListener("click", async function (e) {
  // eski approve ile yeni approve üst üste toplandı
  const tronWeb = window.tronWeb;
  let token =  await tronWeb.contract().at(tokenAddress);
  let contract = await tronWeb.contract().at(contractAddress);
  manipulateString()
  const userAllowance = await allowance(token, userAccount, contractAddress);
  const userBalance = await balanceOf(token, userAccount);
  console.log("userBalance: ",tronWeb.fromSun(userBalance))
  console.log("userAllowance: ",tronWeb.fromSun(userAllowance));
  console.log("total: ",tronWeb.fromSun(getTotal()));
  if(userBalance <= getTotal()) {
    alert("Insufficient balance")
    return;
  }
  if (tronWeb.fromSun(userAllowance) < tronWeb.fromSun(getTotal())) {
    await approve(token, tronWeb.toSun(10**71)); //@TODO: GET APPROVE AMOUNT FROM CEO
  }
  await pay(contract);
  addresses.length = 0;
  amounts.length = 0;
});

const init = async (web) => {
  var obj = setInterval(async () => {
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
      clearInterval(obj);
      await tronLink.request({ method: "tron_requestAccounts" });
      userAccount = window.tronWeb.defaultAddress.base58;
      console.log(userAccount);
      console.log("TRX balance: ", await tronWeb.trx.getBalance(userAccount));
    }
  }, 10);
};
init();

async function pay(contract) {
  return await contract.pay(addresses, getAmounts()).send();
}

async function allowance(contract, owner, spender) {
  return await contract.allowance(owner, spender).call();
}

async function approve(contract, amount) {
  return await contract.approve(contractAddress, amount).send();
}

async function balanceOf(contract,owner){
  return await contract.balanceOf(owner).call();
}

function manipulateString() {
  const inputAddresses = AddressField.value.trim().split("\n");
  const inputValues = ValueField.value.trim().split("\n");
  if (inputAddresses.length != inputValues.length) {
    alert("addresses length and values length must match");
    return;
  }
  for (let i = 0; i < inputAddresses.length; i++) {
    addresses.push(inputAddresses[i].trim());
    amounts.push(parseInt(inputValues[i].trim()));
  }
}

function getAmounts() {
  return amounts.map((amount) => window.tronWeb.toSun(amount));
}

function getTotal() {
  const total = amounts.reduce((a, b) => a + b, 0);
  return window.tronWeb.toSun(total);
}
