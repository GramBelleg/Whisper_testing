import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 50 }, 
    { duration: '1m', target: 50 },  
    { duration: '30s', target: 0 },  
  ],
};

const WUT = 'https://whisper.webredirect.org';
const api = '/api/auth/sendResetCode'; 

export default function () {
  const url = `${WUT}${api}`; 

  
  const payload = JSON.stringify({
    "email": "user@example.com",
  });

  
  const params = {
    headers: {
      'Content-Type': 'application/json', 
    },
  };

  
  const res = http.post(url, payload, params);

  
  check(res, {
    'got a response': (r) => r.status === 404, 
  });

  
  sleep(1);
}
