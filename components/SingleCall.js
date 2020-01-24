import {useState, useEffect} from "react";

import {Button} from "../components/FormElements";
import {singleCall} from "../utils/ethCalls";
import calls from "../utils/sampleCalls";

export default function SingleCall(props) {
	let [result, setResult] = useState(null);
	let [error, setError] = useState(null);
	let [isLoading, setIsLoading] = useState(true);

	
	useEffect(() => {
		init();	
	}, [])

	function init() {
		setResult(null);
		setError(null);
		setIsLoading(true);

		makeCall(calls(props))
		.then(res => setResult(res))
		.catch(error => {
			console.log(error);
			setError(error.message || error);
		})
		.finally(() => setIsLoading(false))
	}

	return (
		<div>
			<h2 className="is-size-5 has-text-centered mb-4">
				Single (splitted) call &nbsp;
				{isLoading && <Button className="button is-white is-loading is-small" />}

			</h2>
			{
				result &&
				<div>
					<h3 className="has-text-centered">Time taken: {result.time} milliseconds</h3>
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
	let finalResult = {};

	let t0 = window.performance.now(); //start time
	for (let [index, call] of calls.entries()) {
		let temp = await singleCall(call);
		let method = calls[index]["contractMethod"];
		finalResult[method] = hexToString(temp);
	}
	let t1 = window.performance.now(); // end time

	return {response: finalResult, time: t1 - t0};
}

function hexToString(hex) {
	// let BN = Web3.utils.BN;
	// return new BN(hex).toString();
	return Number(hex);
}