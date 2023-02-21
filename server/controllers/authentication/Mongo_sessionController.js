const Session = require('../../models/sessionModel');

const createError = ({ method, type, status, err }) => {
  return {
    log: `favoriteRecipeController.${method} \n${type}: ERROR ${
      typeof err === 'object' ? JSON.stringify(err) : err
    }`,
    status,
    message: {
      err: `Error occured in favoriteRecipeController.${method}. Check server logs for more details.`
    }
  };
};

const Mongo_sessionController = {};

// Middleware for starting session using MongoDB approach
Mongo_sessionController.startSession = async (req, res, next) => {
  console.log('In startSession using MongoDB');

  try {
    //Look up the cookieID in the Session collection:
    let session = await Session.findOne({ cookieId: res.locals.user.id });

    //If exist, extend the expiration, a.k.a reset the created at timing
    if (session) session.createdAt = Date.now();
    //Else, create a new session with cookieID & corressponding creationg time in Session collection
    else {
      console.log('create a new session');
      session = await Session.create({ cookieId: res.locals.user.id, createdAt: Date.now() });
    }

    console.log('Session Doc', session);
    //Invoke Next middleware
    return next();
  } catch (err) {
    //Error handler
    return next(
      createError({
        method: 'startSession',
        type: 'Invalid Query for starting session',
        status: 404,
        err
      })
    );
  }
};

//Middleware to check if user has already logged in
Mongo_sessionController.isLoggedIn = async (req, res, next) => {
  console.log('Inside IsLoggedIn using MongoDB');

  //Obtain the SSID cookies from broswer:
  console.log('cookie', req.cookies);
  const cookieId = req.cookies.ssid;

  //If the cookie does not exist, send a message "User is not logged in"
  //TODO: redirect to signup/front page
  if (!cookieId) return res.status(404).json('User is not logged in');

  try {
    //If cookie exists, look up the cookieId in the Session collection:
    const session = await Session.findOne({ cookieId });

    //If no session match, send a mssage "No session found"
    //TODO: redirect to signfront page
    if (!session) return res.status(404).json('No session found');

    //If match, invoke next middleware
    console.log('User Logged In');
    return next();
  } catch (err) {
    //Error handler
    return next(
      createError({
        method: 'isLoggedIn',
        type: 'Invalid Query for confirm user is logged in',
        status: 404,
        err
      })
    );
  }
};

module.exports = Mongo_sessionController;
