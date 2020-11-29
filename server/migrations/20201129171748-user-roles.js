const roles = require('../roles/roles');

module.exports = {
  async up(db) {
    await db.collection('users').updateMany({ role: { $exists: false } }, { $set: { role: roles.REDACTOR } });
  },
};
