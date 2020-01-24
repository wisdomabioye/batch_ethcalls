let Web3 = require("web3")
let web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/" + process.env.INFURA_KEY));

let multicallAbi = require("../abi/multicall.json"); // multicall abi
let multicallContractAddress = "0xeefba1e63905ef1d7acba5a8513c70307c1ce441"; //Mainnet contract Address

export function aggregateCalls(calls /*Array*/) {
	let aggregateCallsArg = calls.map(function(call) {
		return {
			target: call.contractAddress,
			callData: buildCallData(call)
		}
	})

	let aggregateCallsData = buildCallData({
		contractAbi: multicallAbi,
		contractAddress: multicallContractAddress,
		contractMethod: "aggregate",
		methodArgs: [aggregateCallsArg]
	})

	return ethCall(multicallContractAddress, aggregateCallsData)
			.then(response => {
				let decodedResponse = web3.eth.abi.decodeParameters(["uint256", "bytes[]"], response);
				return decodedResponse;
			})
			.catch(error => error);
}

export function ethCall(contractAddress, callData) {
	return new Promise(function(resolve, reject) {
		web3.eth.call({
			to: contractAddress,
			data: callData
		})
		.then(function(response) {
			resolve(response);
		})
		.catch(function(error) {
			reject(error);
		})
	})
}

export function singleCall(callProps) {
	let singleCallData = buildCallData(callProps);
	return ethCall(callProps.contractAddress, singleCallData);
}

export function buildCallData(dataProps) {
	let {
		contractAbi, /*abi Array*/ 
		contractAddress /*address of the contract (a string)*/,
		contractMethod, /*contract method to call (a string)*/  
		methodArgs = [] /*arguments of the contract method (an array)*/
	} = dataProps;

	let contract = new web3.eth.Contract(contractAbi, contractAddress);

	let method = contract.methods[contractMethod](...methodArgs);

	let callData = method.encodeABI();

	return callData;
}
