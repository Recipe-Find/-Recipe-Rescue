const {Recipe} = require("../models/favoriteRecipeModel");

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
const favoriteRecipeController ={};

favoriteRecipeController.saveRecipe = async (req, res, next) => {
    //  Within the request body, destructure to get id, image & title
    console.log('inside favorite controller');
    const { id, title, image, sourceURL } = req.body;
    try{
    // Mongo.create => add the document to the Recipe collection
    res.locals.savedRecipe = await Recipe.create({ id, title, image, sourceURL }, )
    
    //Invoke the next middleware
    return next();
    }
    catch(err){
       return next(createError({
        method: 'saveRecipe',
        type: 'Invalid Query for saving recipes',
        status: 404,
        err
       }))
    }
}

// middleware for getting all recipes
favoriteRecipeController.getRecipes = async (req, res, next) => {
    console.log('getting recipes');
    try{
        // getting everything in collection
        res.locals.recipes = await Recipe.find({})
        return next()
    }catch (err) {
        return next(createError({
         method: 'getRecipes',
         type: 'Invalid Query for getting recipes',
         status: 404,
            err
           }))
    }
    
}

module.exports = favoriteRecipeController;