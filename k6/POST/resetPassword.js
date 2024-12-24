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
const api = '/api/auth/resetPassword'; 

export default function () {
  const url = `${WUT}${api}`; 

  
  const payload = JSON.stringify({
    "email": "user@example.com",
    "password": "string",
    "confirmPassword": "string",
    "code": "test1234"
  });

  
  const params = {
    headers: {
      'Content-Type': 'application/json', 
    },
  };

  
  const res = http.post(url, payload, params);

  
  check(res, {
    'got a response': (r) => r.status === 500, 
  });

  
  sleep(1);
}
