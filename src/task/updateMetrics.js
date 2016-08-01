import raven from 'raven';
// import delay from 'await-delay';
import games from 'data/seeds/games'; // eslint-disable-line
import {rethinkdb} from 'connections';
import {addPlayerCount} from 'data/metrics';
import {getGameByAppId} from 'data/games';
import {steamApi} from 'data/apis';

const ravenClient = new raven.Client();
ravenClient.patchGlobal();

// const UPDATE_INTERVAL = 20 * 1000;
// const SPLAY_INTERVAL = UPDATE_INTERVAL * 2;
// const RETRY_INTERVAL = 60 * 1000;

if (!module.parent) {
  updateMetrics(() => {
    process.exit();
  });
}

function updateMetrics(done) {
  console.log(`Starting updateMetrics`); // eslint-disable-line
  rethinkdb((error) => {
    if (error) { throw error; }
    const promises = games.map(({appid}) => updateGame(parseInt(appid, 10)));
    Promise.all(promises).then(() => {
      done();
    });
  });
}

module.exports = updateMetrics;

async function updateGame(appid) {
  // await delay(Math.random() * SPLAY_INTERVAL);

  try {
    let game = await getGameByAppId(appid);
    console.log(`Updating "${game.name}" (App ID: ${appid})`); // eslint-disable-line
    addPlayerCount(appid, await getNumberOfCurrentPlayers(appid));
    // await delay(UPDATE_INTERVAL);
    // await updateGame(appid);
  } catch(error) {
    ravenClient.captureException(error, {
      tags: {appid}
    }, (result) => {
      console.error(`Error with appid ${appid} (Sentry ID: ${ravenClient.getIdent(result)})\n${error.stack}`); // eslint-disable-line
    });

    // await delay(RETRY_INTERVAL);
    return await updateGame(appid);
  }

  return true;
}

async function getNumberOfCurrentPlayers(appid) {
  let {data} = await steamApi.get('/ISteamUserStats/GetNumberOfCurrentPlayers/v1', {params: {appid}});
  return data.response.player_count;
}
