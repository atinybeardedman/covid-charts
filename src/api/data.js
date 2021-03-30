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
 * function to build the where query string for the counties given
 * @param {boolean} shouldShuffle - should the order be shuffled to bust cache
 * @param {string[]} counties - counties to fetch
 */
function getWhereString(shouldShuffle, counties) {
  let str = "(";
  const tempCounties = shouldShuffle
    ? shuffle(counties.slice())
    : counties.slice();
  const last = tempCounties.pop();
  for (const county of tempCounties) {
    str += `county = "${county}" OR `;
  }
  str += `county = "${last}")`;

  return str;
}

/**
 * function to fetch the data from the api from the counties given
 * @param {boolean} shouldShuffle - should the order be shuffled to bust cache
 * @param {string[]} counties - counties to fetch
 */
const getData = (shouldShuffle, counties) => {
  const params = {
    $where: getWhereString(shouldShuffle, counties),
    $select: "test_date,county,new_positives,total_number_of_tests",
    $order: "test_date DESC",
    $limit: counties.length * 21,
  };
  const options = { params };
  return httpClient.get(process.env.VUE_APP_BASE_URL, options);
};



export { getData};
