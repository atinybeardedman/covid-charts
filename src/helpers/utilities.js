export const spaceToDash = (region) => {
    let regionFixed = region;
    while(regionFixed.indexOf(' ') > 0){
        regionFixed = regionFixed.replace(' ', '-')
    }

}