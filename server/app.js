const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { pages, pageTypes, pageAttributeTypes, components, fields } = require('./routes');

mongoose.connect('mongodb://0.0.0.0:27017/local', {
  useNewUrlParser: true,
  auth: {
    authSource: 'admin',
  },
  user: 'root',
  pass: 'root',
});

const app = express();
const port = 3000;
const rootPath = process.env.NODE_PATH;
app.use(bodyParser.json());
app.use(express.static(path.join(rootPath, 'client/dist')));

app.use('/v1', pages);
app.use('/v1', pageTypes);
app.use('/v1', pageAttributeTypes);
app.use('/v1', components);
app.use('/v1', fields);

app.get('*', (req, res) => res.sendFile('index.html'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
