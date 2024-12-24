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
const api = '/api/messages/1111/draftMessage'; 

export default function () {
  const url = `${WUT}${api}`; 

  const res = http.get(url);

  check(res, {
    'got a response': (r) => r.status === 401, 
  });

  sleep(1);
}
export function handleSummary(data) {
  return {
      'C:/Users/karee/OneDrive/Documents/school/SW Engineering/Project/testing/stress testing/Whisper_testing/k6/reports/draftMessage.html': htmlReport(data),
  };
}
