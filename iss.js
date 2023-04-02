// ISS spotter

const request = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    // parse and extract the IP address using JSON
    const parseBody = JSON.parse(body);
    callback(null, parseBody.ip);
    
  });
};

/**
 * Makes a single API request to retrieve the lat/lng for a given IPv4 address.
 * Input:
 *   - The ip (ipv4) address (string)
 *   - A callback (to pass back an error or the lat/lng object)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The lat and lng as an object (null if error). Example:
 *     { latitude: '49.27670', longitude: '-123.13000' }
 */

const fetchCoordsByIP = function(ip, callback) {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    
    if (error) {
      callback(error, null);
      return;
    }
    // parse the body (string to object)
    const parseBody = JSON.parse(body);
    // check if success is true or not
    if (!parseBody.success) {
      const message = `Success status was ${parseBody.success}. Server message says: ${parseBody.message} when fetching for IP ${parseBody.ip}`;
      callback(Error(message), null);
      return;
    }

    const { latitude, longitude } = parseBody;
    callback(null, {latitude, longitude});
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */

const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(url, (error, response, body) => {
    
    if(error) {
      callback(error, null);
      return;
    }

    if(response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fatching ISS pass times: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const parseBody = JSON.parse(body).response;
    callback(null, parseBody);

  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
*/ 

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      callback(error, null);
      return;
    }

    fetchCoordsByIP(ip, (error, coordinates) => {
      if (error) {
        callback(error, null);
      }

      fetchISSFlyOverTimes(coordinates, (error, passTimesArr) => {
        if (error) {
          callback(error, null);
        }

        callback(null, passTimesArr);
      });

    });

  });
}

module.exports = { nextISSTimesForMyLocation };