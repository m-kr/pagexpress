const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('config');
const { pages, pageTypes, pageAttributeTypes, components, fields } = require('./routes');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
} else if (!config.get('jwtPrivateKey')) {
  console.log('FATAL ERROR: jwtPrivateKey is not defined');

  process.exit();
}

const { DB_HOST, DB_PORT, DB_COLLECTION, DB_USER, DB_PASS, APP_HOST, APP_PORT } = process.env;

mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_COLLECTION}`, {
  useNewUrlParser: true,
  auth: {
    authSource: 'admin',
  },
  user: DB_USER,
  pass: DB_PASS,
});

const app = express();
const host = APP_HOST || '127.0.0.1';
const port = APP_PORT || '3000';

const rootPath = process.env.NODE_PATH;
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(rootPath, 'client/dist')));

app.use('/v1', pages);
app.use('/v1', pageTypes);
app.use('/v1', pageAttributeTypes);
app.use('/v1', components);
app.use('/v1', fields);

app.get('*', (req, res) => res.sendFile('index.html'));

app.listen(port, host);
console.log(`Example app listening at ${host}:${port}`);
