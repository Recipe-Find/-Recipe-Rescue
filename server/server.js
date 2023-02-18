//--------------------------------- START OF IMPORT-----------------------------
const path = require('path');
const express = require('express');
const app = express();
const PORT = 3000;
const recipe = require('./routes/recipe');

//------------------------------- START OF MIDDLEWARE --------------------------
/** Handle parsing request body
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// handle requests for static files
app.use('/', express.static(path.join(__dirname, '../client/assets')));

/**Get recipe based on provided ingredents
 * 1. Get the array of ingredients from the body
 * 2. Fetch API => get title, recipe image, usedIngredient(orignal, which has name and amount), missedIngredient(orginal) & recipeID
 * 3. Fetch API with recipe ID => get the recipeURL
 * 4. Send back to front end JSON with (title, img, array of usedIngredients, array of missedIngredients, and recipeURL)
 */
app.use('/recipe', recipe);

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
