
const getGroupedData = (data) => {
    const counties = {};
    for(const point of data){
        const county = point.county;
        if(!counties[county]){
            counties[county] = [];
        }
        counties[county].push(point.new_positives);
    }
    return counties;
}

export {
    getGroupedData
}