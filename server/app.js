const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const rootPath = path.join(__dirname, '../');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: `${rootPath}.env` });
}

const config = require('config');
const {
  auth,
  componentPatterns,
  countries,
  fields,
  menu,
  pageAttributeTypes,
  pageDetails,
  pageTemplates,
  pageTypes,
  pages,
  users,
} = require('./routes');

if (!config.get('jwtPrivateKey')) {
  console.log('FATAL ERROR: jwtPrivateKey is not defined');

  process.exit();
}

const { host, port, collection, user, password } = config.get('mongodb');
mongoose.connect(`mongodb://${host}:${port}/${collection}`, {
  useNewUrlParser: true,
  auth: {
    authSource: 'admin',
  },
  user: user,
  pass: password,
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/v1', auth);
app.use('/v1', componentPatterns);
app.use('/v1', countries);
app.use('/v1', fields);
app.use('/v1', menu);
app.use('/v1', pageAttributeTypes);
app.use('/v1', pageDetails);
app.use('/v1', pageTemplates);
app.use('/v1', pageTypes);
app.use('/v1', pages);
app.use('/v1', users);

const serverConfig = config.get('server');
app.listen(serverConfig.port, serverConfig.host);
console.log(`App listening at ${serverConfig.host}:${serverConfig.port}`);
