import {connect} from 'rethinkdb';
import ca from 'raw!../config/compose.crt'; // eslint-disable-line

var _rethinkdb = null;
export function rethinkdb(done) {
  if (_rethinkdb) { return _rethinkdb; }

  connect({
    host: process.env.RETHINKDB_HOST,
    port: process.env.RETHINKDB_PORT,
    password: process.env.RETHINKDB_PASSWORD,
    db: 'steam_vr_online',
    user: 'admin',
    ssl: {ca}
  }, (error, connection) => {
    if (error) { return done(error, null); }
    _rethinkdb = connection;
    done(null, _rethinkdb);
  });
}
