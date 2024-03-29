// import * as abi from "./abi/abi"

export async function getAccountBalance(accountAddress, unit = 'ether') {
    let balance = await web3.eth.getBalance(accountAddress);
    return balance;
}

export function weiToEther(value) {
    return web3.utils.fromWei(String(value), 'ether');
}

export function etherToWei(value) {
    return web3.utils.toWei(String(value), 'ether');
}

export async function getAccount() {
    const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
    });
    const account = accounts[0];
    return account;
}

export async function sendTransaction(sender,receiver,val) {
    return await web3.eth.sendTransaction({
        from: sender,
        to: receiver,
        value: val,
    })
}

export async function estimateGas(sender,receiver) {
    return await web3.eth.estimateGas({
        from : sender,
        to : receiver
    });
}

export async function getGasPrice() {
    return await web3.eth.getGasPrice();
}

export async function smartContractWithdraw(contract, amount) {
    
}

export function multiplyWithTenToSix(amount){
    return amount * 10**6;
}

export function divideByTenToSix(amount){
    return amount / 10**6;
}
