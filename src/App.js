import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button"
import { GearTypes } from "./Constants/GearConstants";
import Form from "react-bootstrap/Form";
import { Row, Col } from "react-bootstrap";

const Title = () => {
	return (
		<Container className="page-title">
			<h3>Upgrade Simulator</h3>
		</Container>
	);
};

const TargetUpgrade = () => {
	const [validNumberState, setValidNumberState] = useState(false);

	const validateNumberInput = (input) => {
    console.log(Number.isInteger(+input));
		setValidNumberState(Number.isInteger(+input)); 
	};

  const handleSubmit = (e) => {

  }

	return (
		<Container className="target-upgrade">
			<Form>
				<Row>
					<Col>
						<Form.Select id="gearType" aria-label="Select gear type">
							<option value={GearTypes.armor1302}>{GearTypes.armor1302}</option>
							<option value={GearTypes.weapon1302}>{GearTypes.weapon1302}</option>
						</Form.Select>
					</Col>
					<Col>
						<Form.Select id="startingLevel" aria-label="Select starting level">
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
						<Form.Select id="targetLevel" aria-label="Select starting level">
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
							placeholder="Number of gear pieces"
              step={1}
              min={1}
              max={100}
							onChange={e => validateNumberInput(e.target.value)}
              isInvalid={!validNumberState}
						/>
					</Col>
				</Row>
        <Row>
          <Col>
          <Button type="submit" size="sm">Add</Button>
          <Button type="reset" size="sm">Reset</Button>
          </Col>
        </Row>
			</Form>
		</Container>
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
