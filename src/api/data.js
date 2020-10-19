import httpClient from "./httpClient";
import { counties } from "../constants/constants";

/**
 * Shuffle an array
 * @param {Array} array - the arraw to shuffle
 */
function shuffle(array){
  let current = array.length;
  let tempVal, randomIndex;

  while(0 !== current){
    randomIndex = Math.floor(Math.random() * current);
    current--;

    tempVal = array[current];
    array[current] = array[randomIndex];
    array[randomIndex] = tempVal;
  }
  return array;
}

function getWhereString(shouldShuffle) {
  let str = "(";
  const tempCounties = shouldShuffle ? shuffle(counties.slice()): counties.slice();
  const last = tempCounties.pop();
  for (const county of tempCounties) {
    str += `county = "${county}" OR `;
  }
  str += `county = "${last}"`;
  str += `) AND (test_date >= "2020-07-01")`;
  return str;
}

const getAllData = (shouldShuffle) => {
  const params = {
    $where: getWhereString(shouldShuffle),
    $select: "test_date,county,new_positives,total_number_of_tests",
  };
  const options = {params};
  return httpClient.get(process.env.VUE_APP_BASE_URL, options);
};

export { getAllData };
