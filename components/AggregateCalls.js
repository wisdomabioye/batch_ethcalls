import {useState, useEffect} from "react";

import {Button} from "../components/FormElements";
import {aggregateCalls} from "../utils/ethCalls";
import calls from "../utils/sampleCalls";


export default function AggregateCalls(props) {
	let [result, setResult] = useState(null);
	let [error, setError] = useState(null);
	let [isLoading, setIsLoading] = useState(true);
	
	useEffect(() => {
		init(props);
	}, [props]);

	function resetState() {
		setIsLoading(true);
		setError(null);
		setResult(null);
	}

	function init(addresses) {
		resetState();
		makeCall(calls(addresses))
		.then(res => setResult(res))
		.catch(error => {
			setError(error.message || error);
		})
		.finally(() => setIsLoading(false))
	}

	return (
		<div>
			<h2 className="is-size-5 has-text-centered mb-4">
				Aggregate Calls &nbsp;
				{isLoading && <Button className="button is-white is-loading is-small" />}

			</h2>
			{
				result &&
				<div>
					<h3 className="has-text-centered">Time taken: {result.time} milliseconds</h3>
					<h3 className="mt-2 mb-2">Block: {result.block}</h3>

					<ol>
						{
							Object.keys(result.response).map( (key, i) => (
								<li className="mt-2" key={i}>
									{key}: {result.response[key]}
								</li>
							))
						}
					</ol>
				</div>

			}
			{
				error &&
				<div>
					Error: {error}
				</div>
			}
		</div>
	)
	
}

async function makeCall(calls) {
	let t0 = window.performance.now(); //start time
	let result = await aggregateCalls(calls);
	let t1 = window.performance.now(); // end time
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
	// console.log(callResults);
	return {block, response: finalResult, time: t1 - t0}
}

function hexToString(hex) {
	// let BN = Web3.utils.BN;
	// return new BN(hex).toString();
	return Number(hex);
}