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
      rolling14Avg: [0],
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
        const temp7 =
          counties.Region.rolling7Avg[index - 8] /
          (Object.keys(counties).length - 1);
        counties.Region.rolling7Avg[index - 8] = round(temp7, 4);
        counties.Region.rolling7Avg.push(0);
      }

      if (index > 14) {
        const temp14 =
          counties.Region.rolling14Avg[index - 15] /
          (Object.keys(counties).length - 1);
        counties.Region.rolling14Avg[index - 15] = round(temp14, 4);
        counties.Region.rolling14Avg.push(0);
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
        rolling14Avg: [],
      };
    }
    counties[county].newCases.push(parseInt(point.new_positives));
    counties[county].totalTests.push(parseInt(point.total_number_of_tests));
    counties[county].percentPositive.push(
      round(point.new_positives / point.total_number_of_tests, 4)
    );
    if (index > 6) {
      const county7Avg = round(
        avg(counties[county].percentPositive.slice(index - 7, index)),
        4
      );
      counties[county].rolling7Avg[index - 7] = county7Avg;
      counties.Region.rolling7Avg[index - 7] += county7Avg;
    }
    if (index > 13) {
      const county14Avg = round(
        avg(counties[county].percentPositive.slice(index - 14, index)),
        4
      );
      counties[county].rolling14Avg[index - 14] = county14Avg;
      counties.Region.rolling14Avg[index - 14] += county14Avg;
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
  // index++;
  console.log(index)
  if (index > 6) {
    const temp7 =
      counties.Region.rolling7Avg[index - 7] /
      (Object.keys(counties).length - 1);
    counties.Region.rolling7Avg[index - 7] = round(temp7, 4);
    
  }

  if (index > 13) {
    const temp14 =
      counties.Region.rolling14Avg[index - 14] /
      (Object.keys(counties).length - 1);
    counties.Region.rolling14Avg[index - 14] = round(temp14, 4);
  }
  const dataLength = counties.Region.percentPositive.length;
  const last7Day = avg(counties.Region.percentPositive.slice(dataLength - 7));
  const last14Day = avg(counties.Region.percentPositive.slice(dataLength - 14));
  counties.Region.rolling7Avg.push(round(last7Day, 4));
  counties.Region.rolling14Avg.push(round(last14Day, 4));


  
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

export { getGroupedCountyData, sortByDate };
