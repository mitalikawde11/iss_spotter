const { nextISSTimesForMyLocation } = require('./iss');

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work! ", error);
  }

  printPassTimes(passTimes);
});



/* before refactoring:

  // fetchMyIP((error, ip) => {
  //   if (error) {
  //     console.log("It didn't work!", error);
  //     return;
  //   }

  //   console.log('It worked! Returned IP: ', ip);
  // });

  // fetchCoordsByIP('50.98.123.146', (error, coordinates) => {
  //   if (error) {
  //     console.log("It didn't work!", error);
  //     return;
  //   }

  //   console.log("It worked! Returned Geo Coordinates: ", coordinates);
  // });

  // const coordinates = { latitude: 49.2827291, longitude: -123.1207375 };

  // fetchISSFlyOverTimes(coordinates, (error, passTimes) => {
  //   if (error) {
  //     console.log("It didn't work!", error);
  //     return;
  //   }

  //   console.log("It worked! Returned ISS fly over time: ", passTimes);
  // });

  //  50.98.123.146 (ip)
*/