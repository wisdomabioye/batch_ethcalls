## Aggregate `eth_call`s in a single one
#### This make use of multicall contract (https://github.com/makerdao/multicall)

Chart here: https://live.amcharts.com/mEyZD/ 

| Number of eth_Call  | Aggregate call <br>(Average time in milliseconds)  | Single call <br>(Average time in milliseconds)  |       Comment        |
|:------------------: |:-------------------------------------------------: |:----------------------------------------------: |:-------------------: |
|          1          |                       650.3                        |                      611.8                      |   Single is faster   |
|          2          |                       276.1                        |                     1880.4                      | Aggregate is faster  |
|          3          |                       759.9                        |                     1484.9                      | Aggregate is faster  |
|          4          |                       592.0                        |                     1583.2                      | Aggregate is faster  |
|          5          |                       613.2                        |                     1822.2                      | Aggregate is faster  |
|          6          |                       1225.1                       |                     2967.0                      | Aggregate is faster  |
|          7          |                       931.9                        |                     2871.9                      | Aggregate is faster  |

From the demo, one can deduce that
- Time taken depend on network/internet speed and machine
- If the number of call is 1, single call maybe faster
- The more the number of calls the higher the time taken for a single call to complete while aggregate call stays relatively below 1 seconds on average.

## How to use
### 1. 
##### Using the file utils/ethCall.js

```js
import {aggregateCalls, singleCall} from "../utils/ethCalls";
// `aggregateCalls` takes an array of object of calls 

let abi = require("abi.json");
let contractAddress = "0x738cb...";

let callsSample = [
    {
        contractAbi: abi /* Abi of the contract your're interacting with */,
        contractAddress: contractAddress /* contract address */,
        contractMethod: "totalSupply" /* The method of the contract */,
        methodArgs: [] /* array of parameter of the contract method. It can be omitted if no arg is required */
    },
    {
         contractAbi: abi /* or another contract ABI */,
         contractAddress: contractAddress /* could be another contract address different from callsSample[0] */,
         contractMethod: "balanceOf" /* requires a parameter (address) */, 
         methodArgs: ["0x128383abcd..."] /* balanceOf which address? */

    },
    ...
];

// use callsSample 

makeCall(callsSample);

async function makeCall(callsProp) {
    let result = await aggregateCalls(callsProp);
    console.log(result);
    /* 
        {
        0: "9342397", /* block number */
        1: [ /* result of methods in order of callsSample*/
            "0x00000000000004602913d0701e0",
            "0x000000000000de0b6b3a7640000"
            ]
        }
    */
} 
```
    
    
    
### 2. Run locally
- Clone this repo
- Run npm install
- Update utils/sampleCalls.js (add or remove method in the calls function)
- Do not forget to import the ABI .json file of the contract you will be interacting with. erc20Abiis already provided for convenience.
