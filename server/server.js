//--------------------------------- START OF IMPORT-----------------------------
const path = require('path');
const express = require('express');
const app = express();
const PORT = 3000;
const recipe = require('./routes/recipe');
const favoriteRecipe = require('./routes/favoriteRecipe');
const {createUser, verifyUser} = require('./controllers/userController');
const {setSSIDCookie} = require('./controllers/cookieController');
const {startSession} = require('./controllers/sessionController');

//------------------------------- START OF MIDDLEWARE --------------------------
/** Handle parsing request body
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// handle requests for static files
app.use('/', express.static(path.join(__dirname, '../client/assets')));

//----------------------------SIGNUP, LOGIN & LOGOUT----------------------------
/**SIGNUP
 * 1. POST Request with username & password
 * 2. Create a user in database
 * 3. Set Cookie to header
 * 4. Start the cookie session
 * 5. Redirect to the /recipe page
 */
app.post(
  '/signup',
  [createUser, setSSIDCookie, startSession],
  (req, res) => {
    res.status(200).send('Sign Up Complete');
    //TODO: Need to specify the link if we are running dev environemnt
    // res.redirect('/recipe');
  }
);
/**LOGIN
 * 1. Post Request with username & password. Note, post request is chose since body content sent with post request is more secure
 * 2. Set Cookie to header
 * 3. Start the cookie session
 * 4. Redirect to the /recipe page
 */
app.post('/login', [verifyUser, setSSIDCookie, startSession], (req, res)=> {
  res.status(200).send('Login Complete')
})

//-----------------------------START OF ROUTING REQUESTS------------------------
/**Get recipe based on provided ingredents
 * 1. Get the array of ingredients from the body
 * 2. Fetch API => get title, recipe image, usedIngredient(orignal, which has name and amount), missedIngredient(orginal) & recipeID
 * 3. Fetch API with recipe ID => get the recipeURL
 * 4. Send back to front end JSON with (title, img, array of usedIngredients, array of missedIngredients, and recipeURL)
 */
app.use('/recipe', recipe);

/**Get id, image & title then save to data base
 * 1. Take a post request (/favoriteRecipe)
 * 2. Forward the request to our controller/middleware
 * 3. Within the request body, destructure to get id, image & title
 * 4. Mongo.create => add the document to the Recipe collection
 * 5. Send a message saying "Recipe Added"
 */
app.use('/favoriteRecipe', favoriteRecipe);

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
