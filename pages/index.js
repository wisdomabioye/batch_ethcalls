import {useState, useEffect} from "react";
import Head from "next/head";

import {defaultAddresses, appInfo} from "../app.config";

import "../styles/bulma.min.css";
import "../styles/main.css";

import {Input, Button} from "../components/FormElements";
import AggregateCalls from "../components/AggregateCalls";
import SingleCall from "../components/SingleCall";

export default function Index() {
	let [addresses, setAddresses] = useState(defaultAddresses);	
	let [formData, setFormDate] = useState(defaultAddresses);
	
	useEffect(() => {

	}, [addresses])

	function handleChange(e) {
		let {name, value} = e.target;

		setFormDate({
			...formData,
			[name]: value
		})
	}

	function handleSubmit(e) {
		e.preventDefault();
		setAddresses({...formData});
	}

	return (
		<div className="section">
			<Head>
				<title>{appInfo.name}</title>
			</Head>
			<h1 className="has-text-centered is-size-4 mb-4">
				Multi eth.calls (Aggregate) <strong>  vs </strong>Single call
			</h1>
			<form className="columns is-centered is-vcentered" onSubmit={handleSubmit}>
				<div className="column is-4">
					<Input
						type="text"
						name="contractAddress"
						placeholder="Contract Address"
						onChange={handleChange}
						value={formData.contractAddress}
					/>
				</div>
				<div className="column is-4">
					<Input
						type="text"
						name="ethAddress"
						placeholder="Ethereum Address"
						onChange={handleChange}
						value={formData.ethAddress}
					/>
				</div>
				<div className="column is-2 mt-4">
					<Button 
						className="button is-info"
						type="submit"
						text="Submit"
					/>
				</div>
			</form>
			<div className="columns is-centered">
				<div className="column">
					<div className="box">
						<AggregateCalls {...addresses}/>
					</div>
				</div>
				<div className="column">
					<div className="box">
						<SingleCall {...addresses}/>
					</div>
				</div>
			</div>
			
			<div className="has-text-centered">
				<p>
					getEthBalance: <code>for the Ethereum Address </code>&nbsp;
					totalSupply: <code>of the contract address </code>&nbsp;
					balanceOf: <code>the Ethereum Address on the contract address </code>&nbsp;
				</p>
				<p>
					<a href={appInfo.github}>Github documentation</a>
				</p>
			</div>
		</div>
	)
}