import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { GearTypes } from "./Constants/GearConstants";
import Form from "react-bootstrap/Form";
import { Row, Col } from "react-bootstrap";
import { simulate } from "./Calculations/SimulateMaterialCosts";
import { honingInfoEarlyT3 } from "./Constants/HoningCosts";

const Title = () => {
	return (
		<Container className="page-title">
			<h3>Upgrade Simulator</h3>
		</Container>
	);
};

const MaterialCosts = ({simResults, gearType}) => {
	
	gearType = gearType === GearTypes.armor1302 ? "armor" : "weapon";

	let stones = 0;
	let shards = 0;
	let gold = 0;
	let silver = 0;
	let leapstones = 0;
	let fusions = 0;
	let totalSolarGraces = 0;
	let totalSolarBlessings = 0;
	let totalsolarProtetions = 0;

	Object.entries(simResults).forEach(([targetLevel, averageAttempts]) => {
		let honingInfo = honingInfoEarlyT3[targetLevel][gearType];
		stones += honingInfo.stones * averageAttempts;
		shards += honingInfo.shardsPerUpgrade;
		shards += honingInfo.shardsPerTry * averageAttempts;
		gold += honingInfo.gold * averageAttempts;
		silver += honingInfo.silver * averageAttempts;
		leapstones += honingInfo.leapstones * averageAttempts;
		fusions += honingInfo.fusion * averageAttempts;
		// totalSolarGraces += solarGraces * averageAttempts;
		// totalSolarBlessings += solarBlessings * averageAttempts;
		// totalsolarProtetions += solarProtections * averageAttempts;
	});

	return (
		<Container className="material-costs">
			<b>Stones:</b> {stones} <br/>
			<b>Shards:</b> {shards} <br/>
			<b>Gold:</b> {gold} <br/>
			<b>Silver:</b> {silver} <br/>
			<b>Leapstones:</b> {leapstones} <br/>
			<b>Fusions:</b> {fusions} <br/>
		</Container>
	);
};

const TargetUpgrade = () => {
	// const [validNumberState, setValidNumberState] = useState(false);
	const [simResultsState, setSimResultsState] = useState();
	const [gearTypeState, setGearTypeState] = useState(GearTypes.armor1302)

	let gearType = React.createRef();
	let gearCount = React.createRef();
	let startingLevel = React.createRef();
	let targetLevel = React.createRef();
	let solarBlessings = React.createRef();
	let solarGraces = React.createRef();
	let solarProtections = React.createRef();

	const validateNumberInput = (input) => {
		console.log(Number.isInteger(+input));
		// setValidNumberState(Number.isInteger(+input));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		e.stopPropagation();

		const simulateInfo = {
			startingLevel: startingLevel.current.value || 6,
			targetLevel: targetLevel.current.value || 7,
			solarGraces: solarGraces.current.valueAsNumber || 0,
			solarBlessings: solarBlessings.current.valueAsNumber || 0,
			solarProtections: solarProtections.current.valueAsNumber || 0,
		};

		let simResults = {};
		simResults = simulate(simulateInfo);
		setSimResultsState(simResults);
	};

	return (
		<>
			<Container className="target-upgrade">
				<Form noValidate onSubmit={handleSubmit}>
					<Row>
						<Col>
							<Form.Select id="gearType" aria-label="Select gear type" onChange={e => {
								setGearTypeState(e.target.value)
							}}>
								<option value={GearTypes.armor1302}>{GearTypes.armor1302}</option>
								<option value={GearTypes.weapon1302}>{GearTypes.weapon1302}</option>
							</Form.Select>
						</Col>
						<Col>
							<Form.Select id="startingLevel" aria-label="Select starting level" ref={startingLevel}>
								<option value={1}>Select Starting Level</option>
								<option value={6}>6</option>
								<option value={7}>7</option>
								<option value={8}>8</option>
								<option value={9}>9</option>
								<option value={10}>10</option>
								<option value={11}>11</option>
								<option value={12}>12</option>
								<option value={13}>13</option>
								<option value={14}>14</option>
							</Form.Select>
						</Col>
						<Col>
							<Form.Select id="targetLevel" aria-label="Select target level" ref={targetLevel}>
								<option value={1}>Select Target Level</option>
								<option value={7}>7</option>
								<option value={8}>8</option>
								<option value={9}>9</option>
								<option value={10}>10</option>
								<option value={11}>11</option>
								<option value={12}>12</option>
								<option value={13}>13</option>
								<option value={14}>14</option>
								<option value={15}>15</option>
							</Form.Select>
						</Col>
						<Col>
							<Form.Control
								type="number"
								placeholder="# of Gear"
								step={1}
								min={1}
								max={100}
								ref={gearCount}
							/>
						</Col>
					</Row>
					<Row>
						<Col>
							<Form.Control
								type="number"
								placeholder="# of Solar Graces"
								step={1}
								min={1}
								max={24}
								ref={solarGraces}
							/>
						</Col>
						<Col>
							<Form.Control
								type="number"
								placeholder="# of Solar Blessings"
								step={1}
								min={1}
								max={12}
								ref={solarBlessings}
							/>
						</Col>
						<Col>
							<Form.Control
								type="number"
								placeholder="# of Solar Protections"
								step={1}
								min={1}
								max={4}
								ref={solarProtections}
							/>
						</Col>
					</Row>
					<Row>
						<Col>
							<Button type="submit" size="sm">
								Add
							</Button>
							<Button type="reset" size="sm">
								Reset
							</Button>
						</Col>
					</Row>
				</Form>
			</Container>
			{simResultsState && (
				<Container>
					<MaterialCosts
						simResults={simResultsState}
						gearType={gearTypeState}
					/>
				</Container>
			)}
		</>
	);
};

const App = () => {
	return (
		<>
			<Title />
			<TargetUpgrade />
		</>
	);
};

export default App;
