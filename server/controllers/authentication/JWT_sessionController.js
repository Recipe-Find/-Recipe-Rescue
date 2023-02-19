require('dotenv').config(); //TODO: Need to set this for devlopment only
const jwt = require('jsonwebtoken');
//This is to genenrate random SECRET KEY for ACCESS & REFRESH
// console.log(require('crypto').randomBytes(64).toString('hex'));

const JWT_sessionController = {};

//Middleware for starting session using JWT
JWT_sessionController.startSession = (req, res, next) => {
  console.log('In startSession using JWT');
  //Create a session object with id & username information:
  const session = {
    id: res.locals.user.id,
    username: res.locals.user.username
  };

  //Create an serialized Token, passing in the session object. Set this serialized Token to be expire in 30s
  //This will serialize our session object
  const serializedToken = jwt.sign({ session }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '30s'
  });
  console.log('serializedToken', serializedToken);

  //Persist token to setCookie
  res.locals.serializedToken = serializedToken;
  next();
};

//Middleware to check if user has already logged in
JWT_sessionController.isLoggedIn = async (req, res, next) => {
  console.log('Inside IsLoggedIn using JWT');

  //Obtain the SSID cookies from broswer:
  const cookieId = req.cookies.ssid;
  // console.log("cookie ID:", cookieId)
  //If the cookie does not exist, send a message "User is not logged in"
  //TODO: redirect to signup/front page
  if (!cookieId) return res.status(404).send('User is not logged in');

  try {
    //Verify if the serializedToken is still in session:
    jwt.verify(cookieId, process.env.ACCESS_TOKEN_SECRET);

    //If still in session, invoke next middleware
    return next();
  } catch (err) {
    //Error handler
    //If no session exists, send a mssage "No session found"
    //TODO: redirect to signfront page
    if (err.name === 'TokenExpiredError') {
      return res.status(404).send('No session found');
    }
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

module.exports = JWT_sessionController;
