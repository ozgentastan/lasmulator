import { honingInfoEarlyT3 } from "../Constants/HoningCosts";

//Below calculations are from https://www.easymari.com/en/t3_gear_honing_statistics
const calculateExtraAttemptChance = (targetLevel, attempts) => {
	let result =
		honingInfoEarlyT3[targetLevel].baseSuccessRate +
		(attempts - 1) * honingInfoEarlyT3[targetLevel].successRateIncreasePerAttempt;
	let maxSuccessRate = honingInfoEarlyT3[targetLevel].maxSuccessRate || 1;
	result = result > maxSuccessRate ? maxSuccessRate : result;

	return roundTo(result, 4);
};

const calculateExtraHoningChance = (targetLevel, solarGraces = 0, solarBlessings = 0, solarProtections = 0) => {
	let totalChance = 0.0;

	totalChance += solarGraces * honingInfoEarlyT3[targetLevel].solarGraceIncrease;
	totalChance += solarBlessings * honingInfoEarlyT3[targetLevel].solarBlessingIncrease;
	totalChance += solarProtections * honingInfoEarlyT3[targetLevel].solarProtectionIncrease;

	return roundTo(totalChance, 4);
};

const simulate = ({ startingLevel, targetLevel, solarGraces, solarBlessings, solarProtections }) => {
	const numberOfSimulations = 10000;

	let simResults = {
		7: 0,
		8: 0,
		9: 0,
		10: 0,
		11: 0,
		12: 0,
		13: 0,
		14: 0,
		15: 0,
	};

	for (let i = 0; i < numberOfSimulations; i++) {
		let currentStartingLevel = +startingLevel;
		let currentTargetLevel = +targetLevel;
		for (currentStartingLevel; currentStartingLevel < currentTargetLevel; currentStartingLevel++) {
			let currentUpgradeTargetLevel = currentStartingLevel + 1;
			let attemptCount = simulateUpgrade(
				currentUpgradeTargetLevel,
				solarGraces,
				solarBlessings,
				solarProtections
			);
			simResults[currentUpgradeTargetLevel] += attemptCount;
		}
	}
	Object.entries(simResults).forEach(([key, value]) => {
		simResults[key] = value / numberOfSimulations;
	});
	return simResults;
};

const simulateUpgrade = (targetLevel, solarGraces = 0, solarBlessings = 0, solarProtections = 0) => {
	// Multiple fractions with below to work with integers
	const percentageMultiplier = 10000;
	let isUpgraded = false;
	let attemptCount = 1;
	while (!isUpgraded) {
		let random = Math.floor(Math.random() * percentageMultiplier + 1);
		let successRate = calculateExtraAttemptChance(targetLevel, attemptCount);
		successRate += calculateExtraHoningChance(targetLevel, solarGraces, solarBlessings, solarProtections);
		successRate = roundTo(successRate, 4);

		isUpgraded = random > successRate * percentageMultiplier ? false : true;
		!isUpgraded && (isUpgraded = attemptCount >= honingInfoEarlyT3[targetLevel].maxAttempts);
		!isUpgraded && attemptCount++;
	}

	return attemptCount;
};

// Got below from https://stackoverflow.com/questions/10015027/javascript-tofixed-not-rounding/32605063#32605063
const roundTo = (n, digits) => {
	let multiplicator = Math.pow(10, digits);
	n = parseFloat((n * multiplicator).toFixed(11));
	return Math.round(n) / multiplicator;
};

export { simulate };
