import r from 'rethinkdb';
import {rethinkdb} from 'connections';
import {storeApi} from 'data/apis';

const games = r.table('games');

export async function getGameByAppId(appid) {
  const date = dateForDateTime(new Date());
  const existingCursor = await games.filter({appid, date}).limit(1).run(rethinkdb());
  const existing = await existingCursor.toArray();

  if (existing.length !== 0) {
    return existing[0];
  }

  const data = await fetchGameByAppId(appid);
  const results = await games.insert({
    ...data,
    appid,
    date
  }, {
    conflict: 'replace',
    returnChanges: true
  }).run(rethinkdb());

  return results.changes[0].new_val;
}

export function dateForDateTime(date) {
  let newDate = new Date(date.valueOf());
  newDate.setHours(0);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
}

async function fetchGameByAppId(appid) {
  const {data} = await storeApi.get('/appdetails', {
    params: {appids: appid}
  });

  return data[appid].data;
}
