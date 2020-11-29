const mongoose = require('mongoose');

const dbConnect = ({ host, port, collection, user, password }) => {
  mongoose.connect(`mongodb://${host}:${port}/${collection}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    auth: {
      authSource: 'admin',
    },
    user: user,
    pass: password,
  });
};

module.exports = dbConnect;
