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
const api = '/api/auth/facebook/callback'; 

export default function () {
  const url = `${WUT}${api}`;

  const res = http.get(url);

  check(res, {
    'got a response': (r) => r.status === 401, 
  });


  sleep(1);
}
