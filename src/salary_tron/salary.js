import * as SalaryManagerAbi from "../abi/salaryManagerAbi.js";
const addresses = ["TMQAtmi6qK1WJhVhGuu15aT5uL9Q4tcxtX","TVtT1KLTcnqhTWcYjifnehQdcaBGRorU77"]
const amounts = [2,2]
const contractAddress = "TR3Mt1HDgyzbnUL4AdRQb8iGj6PdKVzjFn";
let userAccount;

const main = async (tronweb) => {
  let token = await tronweb.contract().at("TR3Mt1HDgyzbnUL4AdRQb8iGj6PdKVzjFn");
  let contract = await tronweb
    .contract()
    .at(contractAddress);
  contract.approve("TR3Mt1HDgyzbnUL4AdRQb8iGj6PdKVzjFn",10).send();
  console.log(contract.allowance().call())
};

const init = async (web) => {
  var obj = setInterval(async () => {
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
      clearInterval(obj);
      await tronLink.request({ method: "tron_requestAccounts" })
      console.log("Yes, catch it:",window.tronWeb.defaultAddress.base58)
      userAccount = await tronWeb.trx.getAccount();
      console.log(userAccount.address);
      console.log(await tronWeb.trx.getBalance(userAccount))
    //   main(window.tronWeb);
    }
  }, 10);
};
init();

// const jsonInterface = JSON.parse(JSON.stringify(SalaryManagerAbi.myAbi()));
// const contractAddress = "0xDF817D7C53B48552345C799B62D0157D9F185E8E";
// const contract = window.tronWeb.contract().at(jsonInterface, contractAddress);
// console.log(contract)
