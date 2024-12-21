import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 50 }, // Ramp up to 50 virtual users
    { duration: '1m', target: 50 },  // Stay at 50 virtual users
    { duration: '30s', target: 0 },  // Ramp down to 0 virtual users
  ],
};

const WUT = 'https://whisper.webredirect.org'; // Replace with your server URL
const api = '/api/auth/google'; // Replace with the correct endpoint

export default function () {
  const url = `${WUT}${api}`; // Construct the full URL

  // Define the body for the POST request
  const payload = JSON.stringify({
    "authCode": "sdadasdasdasdasdasdasdw342134erar23"
  });

  // Specify headers for the request
  const params = {
    headers: {
      'Content-Type': 'application/json', // Ensure the server knows the data format
    },
  };

  // Send the POST request
  const res = http.post(url, payload, params);

  // Validate the response
  check(res, {
    'got a response': (r) => r.status === 400, // Ensure the response status is 200
  });

  // Simulate a delay between requests
  sleep(1);
}
