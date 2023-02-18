//Import API Keys:
const { apiKey, spoonacular} = require('../SpoonacularAPI');

//Declare controller:
const recipeController = {};

//Error handler
const createError = ({ method, type, status, err }) => {
  return {
    log: `recipeController.${method} \n${type}: ERROR ${
      typeof err === 'object' ? JSON.stringify(err) : err
    }`,
    status,
    message: {
      err: `Error occured in recipeController.${method}. Check server logs for more details.`
    }
  };
};

//Fetch API with recipe ID => get the recipeURL
recipeController.getRecipeURLByID = async (req, res, next) => {
//   console.log('Inside getRecipeURLByID');

  try {
    // Create a Recipe ID Query
    const recipeID = res.locals.recipes.map(({ id }) => id).join(',');
    // Fetch Data to API
    const fetchedData = await fetch(
      `${spoonacular}/recipes/informationBulk/${apiKey}&ids=${recipeID}`
    );
    const recipes = await fetchedData.json();
    //Filter to only source URL
    const recipeSourceUrl = recipes.map((recipe) => recipe.sourceUrl);
    res.locals.recipes = res.locals.recipes.map((recipe, idx) => {
      return { ...recipe, sourceURL: recipeSourceUrl[idx] };
    });

    //Next Middleware
    return next();

    //Error Handler
  } catch (err) {
    return next(
      createError({
        method: 'getRecipeURLByID',
        type: 'API query',
        status: 404, //404 = NOT FOUND or request not exist on API server
        err
      })
    );
  }
};

module.exports = recipeController;
