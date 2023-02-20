const { useResolvedPath } = require('react-router-dom');
const { Recipe } = require('../models/favoriteRecipeModel');
const User = require('../models/userModel');
require('dotenv').config(); //TODO: Need to set this for devlopment only
const jwt = require('jsonwebtoken');

//Error handler
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

/**Get id, image & title then save to data base
 * 1. Take a post request (/favoriteRecipe)
 * 2. Forward the request to our controller/middleware
 * 3. Within the request body, destructure to get id, image & title
 * 4. Mongo.create => add the document to the Recipe collection
 * 5. Send a message saying "Recipe Added"
 */
const favoriteRecipeController = {};

favoriteRecipeController.saveRecipe = async (req, res, next) => {
  //  Within the request body, destructure to get id, image & title
  console.log('inside favorite controller');

  // getting required parts from request body to save in db
  try {
    //Get the APIid, title, image and sourceURL from the request body
    const { id, title, image, sourceURL } = req.body;

    // Mongo.findOneAndUpdate + upsert => add the document if does not exist to the Recipe collection
    const savedRecipe = await Recipe.findOneAndUpdate(
      { id },
      { id, title, image, sourceURL },
      { upsert: true }
    );

    // saving new saved Recipe in db to locals
    res.locals.savedRecipe = savedRecipe;

    // getting cookie id
    const cookieId = req.cookies.ssid;
    
    // getting username from cookie
    const { session } = jwt.verify(cookieId, process.env.ACCESS_TOKEN_SECRET);
    const { username } = session;

    //Update user's favorite recipe lists:
    //Only add if the savedRecipe does not exist inside the fave recipes list
    const {faveRecipes} = await User.findOne({ username }, { faveRecipes: 1, _id: 0 });
      if (faveRecipes.every(recipe => !recipe._id.equals(savedRecipe._id))){
        faveRecipes.push(savedRecipe._id);
      }
    const currUser = await User.findOneAndUpdate({ username }, { faveRecipes});
    console.log('CURRENT USER:', currUser);

    //Invoke the next middleware
    return next();
  } 
  //Error Handler
  catch (err) {
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

// middleware for getting all recipes
favoriteRecipeController.getRecipes = async (req, res, next) => {
  console.log('getting recipes');
  try {

    // getting cookie id
    const cookieId = req.cookies.ssid;
    
    // getting username from cookie
    const { session } = jwt.verify(cookieId, process.env.ACCESS_TOKEN_SECRET);
    const { username } = session;
    console.log(username)

    // get the faveRecipeList
    const {faveRecipes} = await User.findOne({username}, {faveRecipes: 1})
    console.log(faveRecipes);
    
    //Loop through that array, and get information for id, image, title, sourceURL
    const faveRecipeInformation = await Recipe.find({'_id': {'$in': faveRecipes}})
    // getting everything in collection
    res.locals.recipes = faveRecipeInformation;
    return next();
  } catch (err) {
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

module.exports = favoriteRecipeController;
