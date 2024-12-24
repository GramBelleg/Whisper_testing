import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js'; 

export let options = {
  stages: [
    { duration: '30s', target: 1500 }, 
    { duration: '1m', target: 1500 },  
    { duration: '30s', target: 0 },  
  ],
};

const WUT = 'https://whisper.webredirect.org';
let api = '/api/auth/login'; 

export default function () {
  const url = `${WUT}${api}`; 
  const payload = JSON.stringify({
    "email": "sean_hansen@hotmail.com",
    "password": "Abcdefgh12#"
  }); 

  const params = {
    headers: {
      'Content-Type': 'application/json', 
    },
  };

  const res = http.post(url, payload, params); 

  check(res, {
    'status is 200': (r) => r.status === 200, 
  });

  sleep(1); 
}

export function handleSummary(data) {
  return {
      'C:/Users/karee/OneDrive/Documents/school/SW Engineering/Project/testing/stress testing/Whisper_testing/k6/reports/login.html': htmlReport(data),
  };
}
