function planeToReachLastAirport(airports) {
  // total plane require
  let planeRequire = 0;
  // current level of fuel
  let currentFuel = 0;
  //  reachable distance
  let maximumDistance = 0;

  // looping threw each airports
  for (let i = 0; i < airports.length - 1; i++) {
    // calculate maximum distance to cover
    maximumDistance = Math.max(maximumDistance, i + airports[i]);

    // check for refuel
    if (i === currentFuel) {
      // maximum distance equal to current airport then it is not possible to reach distance
      if (maximumDistance === i) return -1;

      // refuel by assigning maximum distance
      currentFuel = maximumDistance;

      // increment plane requirement
      planeRequire++;
    }
  }

  // return total number of plane require
  return planeRequire;
}

const airport_one = [2, 1, 2, 3, 1];
console.log(planeToReachLastAirport(airport_one)); // Result: 2

const airport_two = [1, 6, 3, 4, 5, 0, 0, 0, 6];
console.log(planeToReachLastAirport(airport_two)); // Result: 3
