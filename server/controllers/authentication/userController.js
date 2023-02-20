const User = require('../../models/userModel');
const userController = {};

//Middleware for creating a new user
userController.createUser = async (req, res, next) => {
  console.log('In createUser');
  //Obtain username & password from request body:
  const { username, password } = req.body;

  //If not providing username or password => send "Username & Password are required"
  if (!username || !password) {
    return res.status(409).send('Username & Password are required');
  }

  try {
    //Create a user with username & password in the User collection
    //Persist the new user throughout the route
    res.locals.user = await User.create({ username, password });

    //Invoke next middleware
    return next();
  } catch (err) {
    //Error handler
    //If username exist in database => Mongoose will throw an error with e.code=11000
    if (err.name == 'MongoServerError' && err.code === 11000) {
      return res.status(409).send('This username is already in used');
    }
    return next(
      createError({
        method: 'createUser',
        type: 'Invalid Query for creating user',
        status: 404,
        err
      })
    );
  }
};

//Middleware for verifying a user
userController.verifyUser = async (req, res, next) => {
  console.log('In verifyUser');
  //Obtain username & password from request body:
  const { username, password } = req.body;
  console.log(req.body);

  //If not providing username or password => send "Username & Password are required"
  if (!username || !password) {
    return res.status(409).send('Username & Password are required');
  }

  try {
    //Verify username & password with documents in User collection
    const user = await User.findOne({ username, password });
    //If not match, send a message "Invalid Username/Password"
    if (!user) return res.status(404).send('Invalid Username/Password');
    //If match, persist the user information to setCookie and start session
    res.locals.user = user;
    //Next Middleware
    return next();
  } catch (err) {
    //Error Handler:
    return next(
      createError({
        method: 'verifyUser',
        type: 'Invalid Query for verifying user',
        status: 404,
        err
      })
    );
  }
};

module.exports = userController;
