let multicallAbi = require("../abi/multicall.json"); // multicall abi
let erc20Abi = require("../abi/erc20.json"); // erc20 abi
let multicallContractAddress = "0xeefba1e63905ef1d7acba5a8513c70307c1ce441"; //Mainnet contract Address

let calls = (addr) => [
	{
		contractAbi: multicallAbi,
		contractAddress: multicallContractAddress,
		contractMethod: "getEthBalance",
		methodArgs: [addr.ethAddress]
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
	},
	{
		contractAbi: erc20Abi,
		contractAddress: addr.contractAddress,
		contractMethod: "totalSupply"
	},
	{
		contractAbi: erc20Abi,
		contractAddress: addr.contractAddress,
		contractMethod: "balanceOf",
		methodArgs: [addr.ethAddress]
	},
]

export default calls;