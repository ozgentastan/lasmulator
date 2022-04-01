import React, { useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { GEAR_TYPES } from "./Constants/GearTypes";
import Form from "react-bootstrap/Form";
import { Row, Col } from "react-bootstrap";
import { simulate } from "./Calculations/SimulateMaterialCosts";
import BootstrapTable from "react-bootstrap-table-next";

const Title = () => {
	return (
		<Container className="page-title">
			<h3>Upgrade Simulator</h3>
		</Container>
	);
};

const MaterialTable = ({ simResultsArray }) => {
	const columns = [{
		dataField: 'name',
		text: 'Gear'
	}, {
		dataField: 'stones',
		text: 'Stones'
	},
	{
		dataField: 'gold',
		text: 'Gold'
	},
	{
		dataField: 'shards',
		text: 'Shards'
	},
	{
		dataField: 'leapstones',
		text: 'Leapstones'
	},
	{
		dataField: 'fusions',
		text: 'Fusions'
	},
	{
		dataField: 'solarGraces',
		text: 'Graces'
	},
	{
		dataField: 'solarBlessings',
		text: 'Blessings'
	},
	{
		dataField: 'solarProtections',
		text: 'Protections'
	},
	{
		dataField: 'totalGoldCost',
		text: 'Total Gold'
	},
	{
		dataField: 'avgAttempts',
		text: 'AVG Attempts'
	}];

	return (
		<BootstrapTable keyField="name" data={simResultsArray} columns={columns} />
	);
};

const TargetUpgrade = () => {
	const [simResultsState, setSimResultsState] = useState([]);

	const gearType = useRef(null);
	const gearCount = useRef(null);
	const startingLevel = useRef(null);
	const targetLevel = useRef(null);
	const solarBlessings = useRef(null);
	const solarGraces = useRef(null);
	const solarProtections = useRef(null);
	const increasedChance = useRef(null);
	const isMax = useRef(null);

	const handleSubmit = (e) => {
		e.preventDefault();
		e.stopPropagation();

		let targetLevelInt = parseInt(targetLevel?.current.value);
		targetLevelInt = targetLevelInt === 1 ? 7 : targetLevelInt;
		let startingLevelInt = parseInt(startingLevel?.current.value);
		startingLevelInt = startingLevelInt === 1 ? 6 : startingLevelInt;

		const simulateInfo = {
			gearType: gearType?.current.value || GEAR_TYPES.armor1302,
			gearCount: gearCount?.current.valueAsNumber || 1,
			startingLevel: startingLevelInt,
			targetLevel: targetLevelInt,
			solarGraces: solarGraces?.current.valueAsNumber || 0,
			solarBlessings: solarBlessings?.current.valueAsNumber || 0,
			solarProtections: solarProtections?.current.valueAsNumber || 0,
			increasedChance: increasedChance?.current.valueAsNumber || 0,
			isMax: isMax?.current.value || false
		};

		console.log(isMax.current);

		let simResults = [...simResultsState];
		simResults.push(simulate(simulateInfo));
		setSimResultsState(simResults);
	};

	const handleReset = (e) => {
		setSimResultsState([]);
	}

	return (
		<>
			<Container className="target-upgrade">
				<Form noValidate onSubmit={handleSubmit} onReset={handleReset}>
					<Row>
						<Col>
							<Form.Select id="gearType" aria-label="Select gear type" ref={gearType}>
								<option value={GEAR_TYPES.armor1302}>{GEAR_TYPES.armor1302}</option>
								<option value={GEAR_TYPES.weapon1302}>{GEAR_TYPES.weapon1302}</option>
								<option value={GEAR_TYPES.armor1340}>{GEAR_TYPES.armor1340}</option>
								<option value={GEAR_TYPES.weapon1340}>{GEAR_TYPES.weapon1340}</option>
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
								min={0}
								max={24}
								ref={solarGraces}
							/>
						</Col>
						<Col>
							<Form.Control
								type="number"
								placeholder="# of Solar Blessings"
								step={1}
								min={0}
								max={12}
								ref={solarBlessings}
							/>
						</Col>
						<Col>
							<Form.Control
								type="number"
								placeholder="# of Solar Protections"
								step={1}
								min={0}
								max={4}
								ref={solarProtections}
							/>
						</Col>
						<Col>
							<Form.Control
								type="number"
								placeholder="Increased Chance"
								step={1}
								min={0}
								max={100}
								ref={increasedChance}
							/>
						</Col>
					</Row>
					<Row>
						<Col>
							<Form.Select id="gearType" aria-label="Average Scenario" ref={isMax}>
								<option value={false}>Average Scenario</option>
								<option value={true}>Worst Case Scenario</option>
							</Form.Select>
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
			{simResultsState.length > 0 && (
				<Container>
					<MaterialTable simResultsArray={simResultsState} />
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
