import httpClient from "./httpClient";
import { counties } from "../constants/constants";
function getWhereString() {
  let str = "(";
  const last = counties.pop();
  for (const county of counties) {
    str += `county = "${county}" OR `;
  }
  str += `county = "${last}"`;
  str += `) AND (test_date >= "2020-07-01")`;
  return str;
}

const getAllData = (bustCache = false) => {
  const params = {
    $where: getWhereString(),
    $select: "test_date,county,new_positives,total_number_of_tests",
  };
  if(bustCache){
    params.cb = Date.now();
  }
  return httpClient.get(process.env.VUE_APP_BASE_URL, {
    params
  });
};

export { getAllData };
