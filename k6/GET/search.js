import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js'; 

export let options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 50 },  
    { duration: '30s', target: 0 },  
  ],
};

const WUT = 'https://whisper.webredirect.org'; 
const api = '/api/messages/global/search?query=a&type=TEXT'; 
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6IlVzZXIiLCJ0aW1lc3RhbXAiOjE3MzQ5ODY0MjkyMTMsImlhdCI6MTczNDk4NjQyOSwiZXhwIjoxNzM1MDcyODI5fQ.7Ke9zPr9SPhSLKeW05Ba37UrYAH05DJENQVJ636po3s';

export default function () {
  const url = `${WUT}${api}`; 

  // Add Authorization header with token
  const params = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  const res = http.get(url, params);

  check(res, {
    'got a response': (r) => r.status === 200, 
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    'C:/Users/karee/OneDrive/Documents/school/SW Engineering/Project/testing/stress testing/Whisper_testing/k6/reports/search.html': htmlReport(data),
  };
}
