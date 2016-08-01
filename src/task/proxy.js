import express from 'express';
import {fromExpress} from 'webtask-tools';

const app = express();

app.get('/', (request, response) => {
  setInterval(() => {
    response.write('{"woot": "cow"}\n');
  }, 1000);
});

export default fromExpress(app);
