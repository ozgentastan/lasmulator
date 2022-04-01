import { HONING_INFO_EARLY_T3, HONING_INFO_MID_T3 } from "../Constants/HoningCosts";
import { GOLD_COSTS } from "../Constants/GoldCosts";
import { GEAR_TYPES } from "../Constants/GearTypes"

//Below calculations are from https://www.easymari.com/en/t3_gear_honing_statistics
const calculateExtraAttemptChance = (targetLevel, attempts) => {
	let result =
		HONING_INFO_EARLY_T3[targetLevel].baseSuccessRate +
		(attempts - 1) * HONING_INFO_EARLY_T3[targetLevel].successRateIncreasePerAttempt;
	let maxSuccessRate = HONING_INFO_EARLY_T3[targetLevel].maxSuccessRate || 1;
	result = result > maxSuccessRate ? maxSuccessRate : result;

	return roundTo(result, 4);
};

const calculateExtraHoningChance = (targetLevel, solarGraces = 0, solarBlessings = 0, solarProtections = 0) => {
	let totalChance = 0.0;

	totalChance += solarGraces * HONING_INFO_EARLY_T3[targetLevel].solarGraceIncrease;
	totalChance += solarBlessings * HONING_INFO_EARLY_T3[targetLevel].solarBlessingIncrease;
	totalChance += solarProtections * HONING_INFO_EARLY_T3[targetLevel].solarProtectionIncrease;

	return roundTo(totalChance, 4);
};

const simulate = ({ startingLevel, targetLevel, solarGraces, solarBlessings, solarProtections, gearType, gearCount, increasedChance, isMax }) => {
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
			let attemptCount;
			if(isMax == "true") {
				attemptCount = HONING_INFO_EARLY_T3[currentUpgradeTargetLevel].maxAttempts;
			} else {
				attemptCount = simulateUpgrade(
					currentUpgradeTargetLevel,
					solarGraces,
					solarBlessings,
					solarProtections,
					increasedChance
				);
			}
			simResults[currentUpgradeTargetLevel] += attemptCount;
		}
	}
	Object.entries(simResults).forEach(([key, value]) => {
		simResults[key] = value / numberOfSimulations;
	});

	simResults = calculateMaterialCosts(simResults, solarGraces, solarBlessings, solarProtections, gearType, gearCount);

	return simResults;
};

const calculateMaterialCosts = (simResults, solarGraces, solarBlessings, solarProtections, gearType, gearCount) => {

	let honingInfoSource;

	if (gearType === GEAR_TYPES.armor1302 || GEAR_TYPES.armor1340) {
		honingInfoSource = gearType === GEAR_TYPES.armor1302 ? HONING_INFO_EARLY_T3 : HONING_INFO_MID_T3;
		gearType = "armor";
	} else {
		honingInfoSource = gearType === GEAR_TYPES.weapon1302 ? HONING_INFO_EARLY_T3 : HONING_INFO_MID_T3;
		gearType = "weapon";
	}

	let costs = {
		stones: 0,
		shards: 0,
		gold: 0,
		silver: 0,
		leapstones: 0,
		fusions: 0,
		solarGraces: 0,
		solarBlessings: 0,
		solarProtections: 0,
		avgAttempts: 0
	}

	console.log(simResults);

	Object.entries(simResults).forEach(([targetLevel, averageAttempts]) => {
		if (averageAttempts !== 0) {
			let honingInfo = honingInfoSource[targetLevel][gearType];
			averageAttempts = Math.ceil(averageAttempts);

			costs.stones += parseInt(honingInfo.stones * averageAttempts * gearCount);
			costs.shards += parseInt(honingInfo.shardsPerUpgrade * gearCount);
			console.log(costs.shards)
			costs.shards += parseInt(honingInfo.shardsPerTry * averageAttempts * gearCount);
			console.log(costs.shards)
			costs.gold += parseInt(honingInfo.gold * averageAttempts * gearCount);
			costs.silver += parseInt(honingInfo.silver * averageAttempts * gearCount);
			costs.leapstones += parseInt(honingInfo.leapstones * averageAttempts * gearCount);
			costs.fusions += parseInt(honingInfo.fusion * averageAttempts * gearCount);
			costs.solarGraces += parseInt(solarGraces * averageAttempts * gearCount);
			costs.solarBlessings += parseInt(solarBlessings * averageAttempts * gearCount);
			costs.solarProtections += parseInt(solarProtections * averageAttempts * gearCount);
			costs.avgAttempts += averageAttempts * gearCount;
		}
	});

	let totalGoldCost = 0;

	Object.entries(costs).forEach(([key, value]) => {
		if (key === "stones") {
			totalGoldCost += costs.stones * GOLD_COSTS[gearType];
		} else if (key === "gold") {
			totalGoldCost += costs.gold;
		} else if (key !== "silver" && key !== "avgAttempts") {
			totalGoldCost += GOLD_COSTS[key] * costs[key];
			console.log()
		}
	});

	costs.totalGoldCost = parseInt(totalGoldCost);

	return costs;
};

const simulateUpgrade = (targetLevel, solarGraces = 0, solarBlessings = 0, solarProtections = 0, increasedChance = 0) => {
	// Multiple fractions with below to work with integers
	const percentageMultiplier = 10000;
	let isUpgraded = false;
	let attemptCount = 1;

	while (!isUpgraded) {
		let random = Math.floor(Math.random() * percentageMultiplier + 1);
		let successRate = calculateExtraAttemptChance(targetLevel, attemptCount);
		successRate += calculateExtraHoningChance(targetLevel, solarGraces, solarBlessings, solarProtections);
		successRate = roundTo(successRate, 4);

		successRate = increasedChance !== 0 ? successRate + (increasedChance / 100) : successRate;

		isUpgraded = random > successRate * percentageMultiplier ? false : true;
		!isUpgraded && (isUpgraded = attemptCount >= HONING_INFO_EARLY_T3[targetLevel].maxAttempts);
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
