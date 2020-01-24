let Web3 = require("web3");
import {aggregateCalls} from "../utils/ethCalls";

let multicallAbi = require("../abi/multicall.json"); // multicall abi
let multicallContractAddress = "0xeefba1e63905ef1d7acba5a8513c70307c1ce441"; //Mainnet contract Address

let calls = [
	{
		contractAbi: multicallAbi,
		contractAddress: multicallContractAddress,
		contractMethod: "getEthBalance",
		methodArgs: ["0xf2f1f7BdB3EB2120faf1d02e1b20FF822B6Fd442"]
	},
	{
		contractAbi: multicallAbi,
		contractAddress: multicallContractAddress,
		contractMethod: "getLastBlockHash",
	},
	{
		contractAbi: multicallAbi,
		contractAddress: multicallContractAddress,
		contractMethod: "getCurrentBlockTimestamp",
	},
	{
		contractAbi: multicallAbi,
		contractAddress: multicallContractAddress,
		contractMethod: "getCurrentBlockGasLimit",
	},
	{
		contractAbi: multicallAbi,
		contractAddress: multicallContractAddress,
		contractMethod: "getCurrentBlockCoinbase",
	}
]


export default function AggregateCalls(props) {
	makeCall();
	return (
		<div>
			AggregateCalls
		</div>
	)
	
}

async function makeCall() {
	let result = await aggregateCalls(calls);
	
	let block = result[0];
	let callResults = result[1];

	/*
	* callResults are in hex
	* convert to String
	*/

	let finalResult = {};

	callResults.forEach(function(res, i) {
		let method = calls[i]["contractMethod"];
		finalResult[method] = hexToString(res);
	})

	
	console.log(finalResult);
	return [block, finalResult]
}

function hexToString(hex) {
	let BN = Web3.utils.BN;
	return new BN(hex).toString();
}