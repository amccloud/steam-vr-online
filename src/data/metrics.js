import r from 'rethinkdb';
import {rethinkdb} from 'connections';

const metrics = r.table('metrics');

export function addPlayerCount(appid, count) {
  metrics.insert({
    type: 'player_count',
    datetime: new Date(),
    appid,
    count
  }, {
    durability: 'soft',
    returnChanges: false
  }).run(rethinkdb());
}
