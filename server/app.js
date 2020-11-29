const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const rootPath = path.join(__dirname, '../');
require('dotenv').config({ path: `${rootPath}.env` });

const config = require('config');
if (!config.get('jwtPrivateKey')) {
  console.log('FATAL ERROR: jwtPrivateKey is not defined');

  process.exit();
}

const app = express();
app.use(bodyParser.json());
app.use(cors());
require('./db/db-connect')(config.get('mongodb'));
require('./routes')(app);

const serverConfig = config.get('server');
app.listen(serverConfig.port, serverConfig.host);
console.log(`App listening at ${serverConfig.host}:${serverConfig.port}`);
