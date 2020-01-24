var Tx = require("ethereumjs-tx");
var Web3 = require("web3")
var web3 = new Web3(new Web3.providers.HttpProvider("https://main.infura.io/v3/" + process.env.INFURA_KEY));

var contractAddress = "0x366156b34e14eCE5f11e4c87eD7c62e9A8bb5e67";
var abiArray = require("./abi");

//set sender address, private key & buffer
  
var ownerAddress = process.env.OWNER_ADDRESS;
var pKey = process.env.PRIVATE_KEY;
var privateKey = new Buffer(pKey, "hex");

//connect to contract address  
var contract = new web3.eth.Contract(abiArray, contractAddress,{
  from: ownerAddress
});

//nonce holder
let nonceChecker = 0;

module.exports = {
	castVote: function (candidate) {
	  return new Promise(function(resolve, reject) {
	    web3.eth.getTransactionCount(ownerAddress)
	    .then(function(nonce) {
	      // transaction count is here
	      //manipulate nonce
	      if( nonce <= nonceChecker) {
	        nonce += 1;
	      } else {
	        nonceChecker = nonce;
	      }
	  
	      let contractMethod = contract.methods.submitVote(candidate);
	      //encode ABI
	      let encodedABI = contractMethod.encodeABI();
	      // console.log('encodedABI>>>', encodedABI);
	      //Estimate gas required for this transaction
	      contractMethod.estimateGas()
	      .then(function(gasLimit) {
	        //current gasLimit estimate for this transaction
	        //as a backup, add 10% of this current gasLimit to gasLimit
	        //In case gasLimit changes which is most unlikely
	        //Unused gas will be returned to the sender
	        
	        gasLimit = Math.ceil(gasLimit + (gasLimit * 0.1));
	        //lets create the transaction
	       
	        let rawTx = {
	          nonce: "0x" + nonce.toString(16),
	          value: "0x0",
	          to: contractAddress,
	          data: encodedABI,
	          gasLimit: web3.utils.toHex(gasLimit),
	          gasPrice: web3.utils.toHex(4000000000)
	          // chainId: 3,
	        }
	        //using ethereumjs-tx to sign rawTx
	        
	        let transaction = new Tx(rawTx);
	        transaction.sign(privateKey);

	        let serialized = transaction.serialize();
	        //lets send the transaction now
	        web3.eth.sendSignedTransaction("0x" + serialized.toString("hex"))
	          .on("transactionHash", function(hash) {
	            resolve(hash);
	          })
	          /*.on('confirmation', function(confirmationNumber, receipt){
	            console.log('confirmationNumber>>',confirmationNumber);
	            console.log('receipt>>', receipt);
	          })*/
	          /*.on('receipt', function(receipt){
	            //transaction successful
	            // console.log('receipt alone', receipt);
	            resolve(receipt.transactionHash);
	          })*/
	          .on("error", function(err) {
	            reject("Error in sending Signed Transaction, try again later.");
	          });
	      }).catch(function(err) {

	        reject("Error getting Gas Price, try again later.")
	        //do some other things or recursion
	      });
	    }).catch(function(err) {
	      reject("Error getting transaction count (nonce), try again later.");
	      // do some other thing()
	    });
	  });
	},

	getVotes: function () {
	  return new Promise(function(resolve, reject) {
	      let contractMethod = contract.methods.getVotes().call();
	      resolve(contractMethod);
	  });
	}
}



