//--------------------------------- START OF IMPORT-----------------------------
const path = require('path');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const PORT = 3000;
const recipe = require('./routes/recipe');
const favoriteRecipe = require('./routes/favoriteRecipe');
const {
  createUser,
  verifyUser,
  isLoggedIn,
  startSession,
  setSSIDCookie
} = require('./controllers/authentication');

//------------------------------- START OF MIDDLEWARE --------------------------
/** Handle parsing request body
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// handle requests for static files
app.use('/', express.static(path.join(__dirname, '../client/assets')));

//transfer all current cookies in browser to the request cookies
app.use(cookieParser());

//----------------------------SIGNUP, LOGIN & LOGOUT----------------------------
/**SIGNUP
 * 1. POST Request with username & password
 * 2. Create a user in database
 * 3. Set Cookie to header
 * 4. Start the cookie session
 * 5. Redirect to the homepage
 */
app.post('/signup', [createUser, startSession, setSSIDCookie], (req, res) => {
  res.status(200).redirect('/');
});
/**LOGIN
 * 1. Post Request with username & password. Note, post request is chose since body content sent with post request is more secure
 * 2. Set Cookie to header
 * 3. Start the cookie session
 * 4. Redirect to the homepage
 */
app.post('/login', [verifyUser, startSession, setSSIDCookie], (req, res) => {
  res.status(200).redirect('/');
});
/**LOGOUT
 * 1. Delete Request with username & password
 * 2. Clear the cookie for accessToken
 * 3. Redirect to homepage
 */
app.delete('/logout', (req, res) => {
  res.clearCookie('ssid');
  res.status(200).redirect('/');
});

//-----------------------------START OF ROUTING REQUESTS------------------------
/**Get recipe based on provided ingredents
 * 1. Get the array of ingredients from the body
 * 2. Fetch API => get title, recipe image, usedIngredient(orignal, which has name and amount), missedIngredient(orginal) & recipeID
 * 3. Fetch API with recipe ID => get the recipeURL
 * 4. Send back to front end JSON with (title, img, array of usedIngredients, array of missedIngredients, and recipeURL)
 */
app.use('/recipe', recipe);

/**Forward all request to favoriteRecipe to router of Favorite Recipe
 * Ensure user is logged in before forwarding the request
 */
app.use('/favoriteRecipe', [isLoggedIn, favoriteRecipe]);

//----------------------------- START OF ERROR HANDLER--------------------------

/**
 * express error handler
 * @see https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
 */

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' }
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

/**
 * start server
 */
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

module.exports = app;
