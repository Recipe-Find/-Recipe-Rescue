const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**Session collection contain cookieId & its createdAt value. All entries will expire within 30s
 * Mongo's cleanup service only runs once per minute so the session could last up to 90 seconds before it's deleted.
 */
const sessionSchema = new Schema({
  cookieId: { type: String, required: true, unique: true },
  createdAt: { type: Date, expires: 30, default: Date.now }
});

module.exports = mongoose.model('Session', sessionSchema);
