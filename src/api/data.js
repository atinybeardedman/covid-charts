import httpClient from "./httpClient";

/**
 * Shuffle an array
 * @param {Array} array - the array to shuffle
 */
function shuffle(array) {
  let current = array.length;
  let tempVal, randomIndex;

  while (0 !== current) {
    randomIndex = Math.floor(Math.random() * current);
    current--;

    tempVal = array[current];
    array[current] = array[randomIndex];
    array[randomIndex] = tempVal;
  }
  return array;
}

/**
 * 
 * @param {boolean} shouldShuffle - should the order be shuffled to bust cache
 * @param {string[]} counties - counties to fetch
 */
function getWhereString(shouldShuffle, counties, startDate) {
  let str = "(";
  const tempCounties = shouldShuffle
    ? shuffle(counties.slice())
    : counties.slice();
  const last = tempCounties.pop();
  for (const county of tempCounties) {
    str += `county = "${county}" OR `;
  }
  str += `county = "${last}"`;
  // TODO: consider changing the date here if adding a range date picker
  str += `) AND (test_date >= "${startDate}")`;
  return str;
}

function get2WeeksAgo(){
  const today = new Date();
  const temp = new Date(today);
  // actually need 3 weeks for 7 day averages
  temp.setTime(temp - 21 * 24 * 3600 * 1000);
  return new Date(temp).toISOString().substr(0,10);
}

const getData = (shouldShuffle, counties, dateMode) => {
  const startDate = dateMode === 0 ? get2WeeksAgo() : '2020-03-01';
  const params = {
    $where: getWhereString(shouldShuffle, counties, startDate),
    $select: "test_date,county,new_positives,total_number_of_tests",
    $limit: 50000,
  };
  const options = { params };
  return httpClient.get(process.env.VUE_APP_BASE_URL, options);
};



export { getData};
