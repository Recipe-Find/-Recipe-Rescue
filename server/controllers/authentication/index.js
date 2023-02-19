const { createUser, verifyUser } = require('./userController');
// const { isLoggedIn, startSession } = require('./Mongo_sessionController');
// const { setSSIDCookie } = require('./Mongo_cookieController');
const { startSession, isLoggedIn } = require('./JWT_sessionController');
const { setSSIDCookie } = require('./JWT_cookieController');

module.exports = { createUser, verifyUser, isLoggedIn, startSession, setSSIDCookie };
