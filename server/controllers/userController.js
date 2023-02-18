const { User } = require('../models/userModel');
const userController = {};

//Middleware for creating a new user
userController.createUser = async (req, res, next) => {
  console.log('In createUser');
  //Obtain username and password from req body:
  const { username, password } = req.body;

  //If not providing username or password => send "Username & Password are required"
  if (!username || !password) {
    return res.status(409).send('Username & Password are required');
  }

  try {
    //Create a user with username & password in the User collection
    const newUser = await User.create({ username, password });
    //Persist the new user throughout the route
    res.locals.user = newUser;
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

module.exports = userController;
