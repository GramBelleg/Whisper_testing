import http from 'k6/http';
import { sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js'; 

const WUT = 'https://whisper.webredirect.org'
let chatid = 1000;
export let options = {
  stages: [
    { duration: '10s', target: 100 }, // Ramp up to 100 users over 30 seconds
    // { duration: '1m', target: 100 }, // Stay at 100 users for 1 minute
    // { duration: '30s', target: 0 },   // Ramp down to 0 users over 30 seconds
  ],
};

export default function () {
  const url = `${WUT}/api/messages/${chatid}/getMessages`;
  const res = http.get(url);
  if (res.status !== 401) {
    console.error(`Request failed: ${res.status}`);
  }
  sleep(1);
}

export function handleSummary(data) {
  return {
      'C:/Users/karee/OneDrive/Documents/school/SW Engineering/Project/testing/stress testing/Whisper_testing/k6/reports/test.html': htmlReport(data),
  };
}

