const fs = require('fs');
const axios = require('axios');
const httpClient = axios.create({
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
        "X-App-Token": "9Aj5UQ5DMxpTR8zuZzP3TcMJu",
    }
});


const parsePopData = (counties) => {
    const dict = {};
    for(const county of counties){
      const name = county.geography;
      const population = parseInt(county.population, 10);
      const space = name.indexOf(' County');
      if(space > -1){
        dict[name.substring(0, space)] = population;
      }
    }
    return dict;
  }

const getCountyPopData = () => {
    const params = {
      $where: "year = 2019",
      $select: "geography,population",
    };
    const options = { params };
    return httpClient.get("https://data.ny.gov/resource/krt9-ym2k.json", options);
  };

const savePopData = () => {
    return getCountyPopData()
        .then(resp => parsePopData(resp.data))
        .then(dict => 
            fs.writeFileSync('../constants/popDict.js', `export const population = ${JSON.stringify(dict)}`)
        ).catch(err => console.log(err));
}

savePopData()