const { useResolvedPath } = require('react-router-dom');
const { Recipe } = require('../models/favoriteRecipeModel');
const User = require('../models/userModel');
require('dotenv').config(); //TODO: Need to set this for devlopment only
const jwt = require('jsonwebtoken');

//------------------------------ERROR HANDLER-----------------------------------
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

//-----------------------------INITIALIZE HANDLER-------------------------------
const favoriteRecipeController = {};

//--------------------------POST/ADD FAVORITE RECIPE----------------------------
/**Take a post request (/favoriteRecipe)
 * 1. Within the request body, destructure to get id, image, sourceURL & title of the favorite recipe
 * 2. Convert cookie SSID to get username
 * 3. Add the recipe document to the Recipe collection
 * 4. Add the reference _id of the newly created recipe document to current user list of favorite recipes
 * 5. Send a message saying "Recipe Added" & the newly added recipe
 */
favoriteRecipeController.saveRecipe = async (req, res, next) => {
  console.log('inside favorite controller');

  //Get the APIid, title, image and sourceURL from the request body
  const { id, title, image, sourceURL } = req.body;

  // Get cookie id
  const cookieId = req.cookies.ssid;
  // Get username from cookie
  const { username } = jwt.verify(cookieId, process.env.ACCESS_TOKEN_SECRET);

  try {
    // Mongo.findOneAndUpdate + upsert => add the document if does not exist to the Recipe collection => return the updated recipe document
    const savedRecipe = await Recipe.findOneAndUpdate(
      { id },
      { id, title, image, sourceURL },
      { upsert: true, new: true }
    );
    // Persist the newly saved Recipe to locals
    res.locals.savedRecipe = savedRecipe;

    //Obtain the current favorite recipe list
    const { faveRecipes } = await User.findOne({ username }, { faveRecipes: 1, _id: 0 });
    //Only add if the savedRecipe does not exist inside the fave recipes list
    if (faveRecipes.every((recipe) => !recipe._id.equals(savedRecipe._id))) {
      faveRecipes.push(savedRecipe._id);
    }
    //Update user's favorite recipes list
    await User.findOneAndUpdate({ username }, { faveRecipes });

    //Invoke the next middleware
    return next();
  } catch (err) {
    //Error Handler
    return next(
      createError({
        method: 'saveRecipe',
        type: 'Invalid Query for saving recipes',
        status: 404,
        err
      })
    );
  }
};

//---------------------GET FAVORITE RECIPES OF CURRENT USER---------------------
/**Take a get request (/favoriteRecipe)
 * 1. Convert cookie SSID to get username
 * 2. Get the list of favorite recipes reference _id from current user
 * 3. Get all recipe documents from Recipe collection with matching _id from current user favorite
 * 4. Send a JSON with information of all favorite recipes of the current user
 */
favoriteRecipeController.getRecipes = async (req, res, next) => {
  console.log('inside favorite controller');
  // Get cookie id
  const cookieId = req.cookies.ssid;
  // Get username from cookie
  const { username } = jwt.verify(cookieId, process.env.ACCESS_TOKEN_SECRET);

  try {
    // Get the list of favorite recipe of the curernt user
    const { faveRecipes } = await User.findOne({ username }, { faveRecipes: 1 });

    // Get all recipe documents that has matching _id from user favorite recipe list
    const faveRecipeInformation = await Recipe.find({ _id: { $in: faveRecipes } });

    // Persist all information of favorite recipes to locals
    res.locals.faveRecipeInformation = faveRecipeInformation;
    return next();
  } catch (err) {
    //Error Handler
    return next(
      createError({
        method: 'getRecipes',
        type: 'Invalid Query for getting recipes',
        status: 404,
        err
      })
    );
  }
};

//---------------------DELETE FAVORITE RECIPE-----------------------------------
/**Take a delete request (/favoriteRecipe)
 * 1. Within the query, destructure to get the recipe id
 * 2. Convert cookie SSID to get username
 * 3. Remove the recipe id from the current user list of favorite recipes
 * 4. Get all recipe documents from Recipe collection with matching _id from udpated favorite list
 * 5. Send a JSON with the information of the udpated list of favorite recipes
 */
favoriteRecipeController.deleteRecipe = async (req, res, next) => {
  //Get recipe id from Request Body
  const { id } = req.query;
  // Get cookie id
  const cookieId = req.cookies.ssid;
  // Get username from cookie
  const { username } = jwt.verify(cookieId, process.env.ACCESS_TOKEN_SECRET);
  console.log({ username, id });
  try {
    // Get the list of favorite recipe of the curernt user
    const { faveRecipes } = await User.findOne({ username }, { faveRecipes: 1 });
    //Remove reference of recipe _id from current user favorite recipe by filtering out the recipe matching with the _id from request query
    const updatedFaveRecipes = faveRecipes.filter((recipeId) => !recipeId.equals(id));
    //Update database with the updated list of faveRecipes:
    await User.findOneAndUpdate({ username }, { faveRecipes: updatedFaveRecipes });

    // Get all recipe documents that has matching _id from user udpated favorite recipe list
    const faveRecipeInformation = await Recipe.find({ _id: { $in: updatedFaveRecipes } });

    // Persist all information of favorite recipes to locals
    res.locals.faveRecipeInformation = faveRecipeInformation;
    //Next middleware
    next();
  } catch (err) {
    //Error handler
    return next(
      createError({
        method: 'deleteRecipe',
        type: 'Invalid Query for deleting recipes',
        status: 404,
        err
      })
    );
  }
};

module.exports = favoriteRecipeController;
