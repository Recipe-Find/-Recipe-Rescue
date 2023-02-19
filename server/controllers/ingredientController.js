//Import API Keys:
const { apiKey, spoonacular, numOfRecipes, minMissedIng } = require('../SpoonacularAPI');

//Declare controller:
const ingredientController = {};

//Error handler
const createError = ({ method, type, status, err }) => {
  return {
    log: `ingredientController.${method} \n${type}: ERROR ${
      typeof err === 'object' ? JSON.stringify(err) : err
    }`,
    status,
    message: {
      err: `Error occured in ingredientController.${method}. Check server logs for more details.`
    }
  };
};

//Fetch API => get title, recipe image, usedIngredient(orignal, which has name and amount), missedIngredient(orginal) & recipeID
ingredientController.getRecipeByIngredient = async (req, res, next) => {
  //   console.log('Inside ingredients controller');
  // Get the array of ingredients from the body
  // const ingredents = req.body.ingredients;
  const ingredientsQuery = req.query.ingredients;

  //Create a Query
  // const ingredientsQuery = ingredents.join(',+');
  const queryRequirement = {
    ingredients: ingredientsQuery,
    number: numOfRecipes,
    ranking: minMissedIng,
    ignorePantry: true
  };
  const APIQuery = Object.entries(queryRequirement).reduce((prev, [name, requirement]) => {
    return `${prev}&${name}=${requirement}`;
  }, '');

  try {
    //Fetch Data to API
    const fetchedData = await fetch(
      `${spoonacular}/recipes/findByIngredients/${apiKey}${APIQuery}`
    );
    let recipes = await fetchedData.json();

    //Filter out to get title, recipeimage, usedIngredient original, missedIngrident origina, recipeID
    recipes = recipes.map(({ id, title, image, missedIngredients, usedIngredients }) => {
      missedIngredients = missedIngredients.map(({ original }) => original);
      usedIngredients = usedIngredients.map(({ original }) => original);
      return { id, title, image, missedIngredients, usedIngredients };
    });
    res.locals.recipes = recipes;

    //Next Middleware
    return next();

    //Error Handler
  } catch (err) {
    return next(
      createError({
        method: 'getRecipeByIngredient',
        type: 'API query',
        status: 404, //404 = NOT FOUND or request not exist on API server
        err
      })
    );
  }
};

module.exports = ingredientController;
