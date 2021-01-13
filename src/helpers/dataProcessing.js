import { listProps, regionDict } from "../constants/constants";
import { population } from "../constants/popDict";

/**
 * Summarize and group the API data by county
 * @param {Object[]} data - DoH API data in an array
 * @param {String} region - name of the region
 */
const getGroupedCountyData = (data, region) => {
  if (data.length === 0) {
    // if nothing is here yet, return empty object
    return {};
  }

  const regionTotalPopulation = getRegionPopulation(region);
  const countyList = regionDict[region];
  const counties = {};
  for (const county of countyList) {
    // initialize the summary object for each county
    counties[county] = generateSummaryObject();
  }

  // initialize the summary object for the region
  counties.Region = generateSummaryObject();

  // set the initial date to the first date found
  let date = data[0].test_date;
  let index = 0; // tracks when we have moved to a new day of data
  // set up the regional sums at 0
  let regionCases = 0;
  let regionTests = 0;

  for (const point of data) {
    // walk through list and propogate county based data
    const county = point.county;

   

    if (date !== point.test_date) {
      // when date changes, increment index and tally regional data
      date = point.test_date;
      // set regional totals for this date
      counties.Region.newCases.push(regionCases);
      counties.Region.totalTests.push(regionTests);

      // calculate regional percent positive rate for this date
      counties.Region.percentPositive.push(round(
        regionCases / regionTests,
        4
      ));

      index++;
      if (index > 6) {
        // we now have 7 days of region data, we can start creating 7 day averages

        const region7DayCases = counties.Region.newCases.slice(
          index - 7,
          index
        );
        console.log(index)
        const region7DayTests = counties.Region.totalTests.slice(
          index - 7,
          index
        );

        // rolling positive percentage
        counties.Region.rolling7Avg.push(
          round(unWeightedAvg(region7DayCases, region7DayTests), 4)
        );

        // rolling case avg.
        counties.Region.rollingCaseAvg.push(
          calcCasePer100k(avg(region7DayCases), regionTotalPopulation)
        );
      }

      regionCases = 0;
      regionTests = 0;
    }

    // When we have 7 days of data, generate the 7 day averages
    if (index > 6) {
      // percent avg
      const county7DayCases = counties[county].newCases.slice(index - 7, index);
      const county7Avg = round(
        unWeightedAvg(
          county7DayCases,
          counties[county].totalTests.slice(index - 7, index)
        ),
        4
      );
      counties[county].rolling7Avg[index - 7] = county7Avg;

      // case avg
      const countyCaseAvg = calcCasePer100k(
        avg(county7DayCases),
        population[county]
      );
      counties[county].rollingCaseAvg[index - 7] = countyCaseAvg;
    }

    counties[county].newCases.push(parseInt(point.new_positives));
    counties[county].totalTests.push(parseInt(point.total_number_of_tests));
    counties[county].percentPositive.push(
      round(point.new_positives / point.total_number_of_tests, 4)
    );

    // update sums for whole region
    regionCases += parseInt(point.new_positives);
    regionTests += parseInt(point.total_number_of_tests);
  }

  // last day of averages never gets added since the loop ends
  index++;

  for (const county of countyList) {
    // percent avg
    const county7DayCases = counties[county].newCases.slice(index - 7, index);
    const county7Avg = round(
      unWeightedAvg(
        county7DayCases,
        counties[county].totalTests.slice(index - 7, index)
      ),
      4
    );
    counties[county].rolling7Avg[index - 7] = county7Avg;

    // case avg
    const countyCaseAvg = calcCasePer100k(
      avg(county7DayCases),
      population[county]
    );
    counties[county].rollingCaseAvg[index - 7] = countyCaseAvg;
  }

  counties.Region.newCases.push(regionCases);
  counties.Region.totalTests.push(regionTests);
  counties.Region.percentPositive.push(round(
    regionCases / regionTests,
    4
  ));
  const region7DayCases = counties.Region.newCases.slice(index - 7, index);
  const region7DayTests = counties.Region.totalTests.slice(index - 7, index);
  
  // rolling positive percentage
  counties.Region.rolling7Avg.push(
    round(unWeightedAvg(region7DayCases, region7DayTests), 4)
    );
    
    // rolling case avg.
    counties.Region.rollingCaseAvg.push(
      calcCasePer100k(avg(region7DayCases), regionTotalPopulation)
      );
  console.log(counties);
  return counties;
};



/**
 * calculate the average of a list of numbers
 * @param {int[]} list - list of numbers
 */
function avg(list) {
  let sum = 0;
  for (const num of list) {
    sum += num;
  }
  return sum / list.length;
}

/**
 * simple sum callback for reducing lists
 * @param {*int} acc - accumulator
 * @param {*int} curr - current value
 */
function sum(acc, curr) {
  return acc + curr;
}

/**
 * calculate the unweighted average using a list of numerators and a list of denomenators
 * @param {int[]} numList - list of numbers for numerator
 * @param {*int[]} denomList - list of numbers for denomonator
 */
function unWeightedAvg(numList, denomList) {
  const numerator = numList.reduce(sum);
  const denomonator = denomList.reduce(sum);
  return numerator / denomonator;
}

/**
 * rounds a number to n decimals
 * @param {Number} num - number to round
 * @param {Number} decimals - number of decimals to round to
 */
function round(num, decimals) {
  return parseFloat(num.toFixed(decimals));
}

/**
 * Calculates the total regional population
 * @param {String} region - name of the region
 */

function getRegionPopulation(region) {
  const counties = regionDict[region];
  return counties.map((county) => population[county]).reduce(sum);
}

/**
 * Generates the object with properties for the summary data
 */
function generateSummaryObject() {
  return {
    newCases: [],
    totalTests: [],
    percentPositive: [],
    rolling7Avg: [],
    rollingCaseAvg: [],
  };
}

/**
 * sort the api by test date
 * @param {Object} a - api data
 * @param {Object} b - api data
 */
const sortByDate = (a, b) => {
  if (a.test_date > b.test_date) {
    return 1;
  } else if (a.test_date < b.test_date) {
    return -1;
  } else {
    return 0;
  }
};
/**
 *
 * @param {Object} countyData - county data
 * @param {int} sliceAmount - amount of data to slice off the end
 */
const sliceData = (countyData, sliceAmount) => {
  const result = {};
  if (
    typeof countyData === "undefined" ||
    JSON.stringify(countyData) === "{}"
  ) {
    return result;
  }
  for (const prop of listProps) {
    const length = countyData[prop].length;
    result[prop] = countyData[prop].slice(length - sliceAmount);
  }
  return result;
};

/**
 *
 * @param {float} caseAvg - case avg
 * @param {string} countyPop- county population
 */
const calcCasePer100k = (caseAvg, countyPop) => {
  const avg = round((caseAvg / countyPop) * 100000, 1);
  return avg;
};

export { getGroupedCountyData, sortByDate, sliceData };
