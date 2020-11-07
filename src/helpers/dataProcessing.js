import { listProps, population } from "../constants/constants";

/**
 * Summarize and group the API data by county
 * @param {Object[]} data - DoH API data in an array
 */
const getGroupedCountyData = (data) => {
  const propsToIncrement = ["newCases", "totalTests", "percentPositive"];
  if (data.length === 0) {
    return {};
  }
  let date = data[0].test_date;
  const counties = {
    Region: {
      newCases: [0],
      totalTests: [0],
      percentPositive: [0],
      rolling7Avg: [0],
      rollingCaseAvg: [0],
    },
  };
  let index = 0;
  for (const point of data) {
    // walk through list and propogate county based data
    const county = point.county;
    if (date !== point.test_date) {
      // when date changes, increment index and initialize Region counters
      const RegionPercentTemp =
        counties.Region.percentPositive[index] /
        (Object.keys(counties).length - 1);
      counties.Region.percentPositive[index] = round(RegionPercentTemp, 4);
      index++;
      date = point.test_date;
      if (index > 7) {
        // rolling positive percentage 
        const temp7 =
          counties.Region.rolling7Avg[index - 8] /
          (Object.keys(counties).length - 1);
        counties.Region.rolling7Avg[index - 8] = round(temp7, 4);
        counties.Region.rolling7Avg.push(0);

        // rolling case avg.
        const caseAvg = counties.Region.rollingCaseAvg[index - 8] / (Object.keys(counties).length - 1);
        counties.Region.rollingCaseAvg[index - 8] = round(caseAvg, 1)
        counties.Region.rollingCaseAvg.push(0);
      }


      for (const prop of propsToIncrement) {
        counties.Region[prop].push(0);
      }
    }
    if (!counties[county]) {
      counties[county] = {
        newCases: [],
        totalTests: [],
        percentPositive: [],
        rolling7Avg: [],
        rollingCaseAvg: [],
      };
    }
    counties[county].newCases.push(parseInt(point.new_positives));
    counties[county].totalTests.push(parseInt(point.total_number_of_tests));
    counties[county].percentPositive.push(
      round(point.new_positives / point.total_number_of_tests, 4)
    );
    if (index > 6) {
      // percent avg
      const county7Avg = round(
        avg(counties[county].percentPositive.slice(index - 7, index)),
        4
      );
      counties[county].rolling7Avg[index - 7] = county7Avg;
      counties.Region.rolling7Avg[index - 7] += county7Avg;

      // case avg

      let countyCaseAvg = calcCasePer100k(
        avg(counties[county].newCases.slice(index - 7, index)), county);
      counties[county].rollingCaseAvg[index - 7] = countyCaseAvg;
      counties.Region.rollingCaseAvg[index - 7] += countyCaseAvg;
    }

    // update summary for whole region
    counties.Region.newCases[index] += parseInt(point.new_positives);
    counties.Region.totalTests[index] += parseInt(point.total_number_of_tests);
    counties.Region.percentPositive[index] +=
      counties[county].percentPositive[index];
  }
  const RegionPercentTemp =
    counties.Region.percentPositive[index] / (Object.keys(counties).length - 1);
  counties.Region.percentPositive[index] = round(RegionPercentTemp, 4);
  
  if (index > 6) {
    // percentage avg
    const temp7 =
      counties.Region.rolling7Avg[index - 7] /
      (Object.keys(counties).length - 1);
    counties.Region.rolling7Avg[index - 7] = round(temp7, 4);

    // case avg.
    const tempCases =
    counties.Region.rollingCaseAvg[index - 7] /
    (Object.keys(counties).length - 1);
  counties.Region.rollingCaseAvg[index - 7] = round(tempCases, 1);
    
  }

  // last day never gets added since the loop ends
  for(const county of Object.keys(counties)){
    const dataLength = counties[county].percentPositive.length;
    const last7Day = avg(counties[county].percentPositive.slice(dataLength - 7));
    counties[county].rolling7Avg.push(round(last7Day, 4));
  
    const casesLength = counties[county].newCases.length;
    const cases7Day = avg(counties[county].newCases.slice(casesLength - 7));
    counties[county].rollingCaseAvg.push(round(calcCasePer100k(cases7Day, county), 1));
    
  }


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
 * rounds a number to n decimals
 * @param {Number} num - number to round
 * @param {Number} decimals - number of decimals to round to
 */
function round(num, decimals) {
  return parseFloat(num.toFixed(decimals));
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
    if(typeof countyData === 'undefined' || JSON.stringify(countyData) === "{}"){
      return result
    }
    for(const prop of listProps){
      const length = countyData[prop].length;
      result[prop] = countyData[prop].slice(length - sliceAmount);
    }
  return result
}

/**
 * 
 * @param {float} caseAvg - case avg
 * @param {string} countyName - case avg
 */
const calcCasePer100k = (caseAvg, countyName) => {
  const countyPop = population[countyName];
  const avg = round((caseAvg / countyPop) * 100000, 1);
  return avg;
}

export { getGroupedCountyData, sortByDate, sliceData }