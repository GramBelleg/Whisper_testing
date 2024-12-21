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
let api = '/api/auth/login'; 

export default function () {
  const url = `${WUT}${api}`; 
  const payload = JSON.stringify({
    email: 'eden74@yahoo.com',
    password: '22222222',
  }); 

  const params = {
    headers: {
      'Content-Type': 'application/json', 
    },
  };

  const res = http.post(url, payload, params); 

  check(res, {
    'status is 200': (r) => r.status === 404, 
  });

  sleep(1); 
}
