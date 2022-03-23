import { honingInfoEarlyT3 } from "./RawData/honingCosts";

const secondAttempt = (baseRate) => {
    const result = baseRate + (0.1*baseRate);
    // return Math.round((result + Number.EPSILON) * 100) / 100
    return roundTo(result, 3);

}

const thirdOrMoreAttempt = (baseRate, attempts) => {
    const result = secondAttempt(baseRate) + (attempts / 100 - 0.02);
    // return Math.round((result + Number.EPSILON) * 100) / 100;
    return roundTo(result, 3);
}

let simResults = [];
let totalCost = 0;

const simulate = () => {
    let targetLevel = 15;
        for (let simulations = 0; simulations < 1000; simulations++) {
            simulateUpgrade(targetLevel);
        }

        simResults.forEach(attempts => {
            totalCost = totalCost + attempts * honingInfoEarlyT3[targetLevel].shards;
        });

        console.log(totalCost / 1000);

}

const simulateUpgrade = (targetLevel) => {
    let isUpgraded = false;
    let attemptCounts = 1;
    let successRate;
    while (!isUpgraded) {
        let random = Math.floor(Math.random() * 1000 + 1);
        let baseRate = honingInfoEarlyT3[targetLevel].baseSuccessRate;

        if(attemptCounts == 1) {
            successRate = baseRate;
        } else if (attemptCounts == 2) {
            successRate = secondAttempt(baseRate);
        } else {
            successRate = thirdOrMoreAttempt(baseRate, attemptCounts);
        }
        isUpgraded = random > (successRate * 1000) ? false : true;
        attemptCounts = attemptCounts + 1;
    }
    simResults.push(attemptCounts);
    console.log(attemptCounts);
}

// Got below from https://stackoverflow.com/questions/10015027/javascript-tofixed-not-rounding/32605063#32605063
const roundTo = (n, digits) => {
    let multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    return Math.round(n) / multiplicator;
}

simulate();
