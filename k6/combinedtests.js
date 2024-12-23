import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js'; 

// Define the options for load testing
export let options = {
  stages: [
    { duration: '30s', target: 2000 },
    { duration: '1m', target: 2000 },
    { duration: '30s', target: 0 },
  ],
};

// Define your base URL
const WUT = 'https://whisper.webredirect.org';

// Test 1: Login Test
export default function loginTest() {
  let api = '/api/auth/login';
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

// Test 2: Update Bio Test
export function updateBioTest() {
  const api = '/api/user/bio';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6IlVzZXIiLCJ0aW1lc3RhbXAiOjE3MzQ5ODY0MjkyMTMsImlhdCI6MTczNDk4NjQyOSwiZXhwIjoxNzM1MDcyODI5fQ.7Ke9zPr9SPhSLKeW05Ba37UrYAH05DJENQVJ636po3s';
  const url = `${WUT}${api}`;
  const payload = JSON.stringify({
    "bio": "New bio for user"
  });

  const params = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  const res = http.put(url, payload, params);

  check(res, {
    'got a response': (r) => r.status === 200,
  });

  sleep(1);
}

// Test 3: Another Test (if you have another one)
export function anotherTest() {
    const WUT = 'https://whisper.webredirect.org'; 
    const api = '/api/messages/global/search?query=a&type=TEXT'; 
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6IlVzZXIiLCJ0aW1lc3RhbXAiOjE3MzQ5ODY0MjkyMTMsImlhdCI6MTczNDk4NjQyOSwiZXhwIjoxNzM1MDcyODI5fQ.7Ke9zPr9SPhSLKeW05Ba37UrYAH05DJENQVJ636po3s';

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

// Combine results into a single report
export function handleSummary(data) {
  return {
    'C:/Users/karee/OneDrive/Documents/school/SW Engineering/Project/testing/stress testing/Whisper_testing/k6/reports/combined_report.html': htmlReport(data),
  };
}
