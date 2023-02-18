const Session = require('../models/sessionModel');
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

const sessionController = {};

// middleware for starting session
sessionController.startSession = async (req, res, next) => {
  console.log('In startSession Cookie');
  try {
    //Look up the cookieID in the Session collection:
    let session = await Session.findOne({ cookieId: res.locals.user.id });
    // console.log('session  after trying to find', session);
    //If exist, extend the expiration, a.k.a reset the created at timing
    if (session) session.createdAt = Date.now();
    //Else, create a document of cookieID & corressponding creationg time in Session collection
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

module.exports = sessionController;
