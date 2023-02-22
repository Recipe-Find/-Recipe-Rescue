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
  console.log('Inside ingredients controller');
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
  console.log({APIQuery})
  try {
    
    //GET https://api.spoonacular.com/recipes/complexSearch --> gotta switch to complexSearch
    //Response Headers: Content-Type: application/json

    ///recipe/searchByIngredient?ingredients=${ingredients.join(',+')}
    //Fetch Data to API
    console.log('query request: ', `${spoonacular}/recipes/findByIngredients/${apiKey}${APIQuery}`)
    const fetchedData = await fetch(
      `${spoonacular}/recipes/findByIngredients/${apiKey}${APIQuery}`
    );
    let recipes = await fetchedData.json();
    console.log('fetched and parsed data')

    //Filter out to get title, recipeimage, usedIngredient original, missedIngrident origina, recipeID
    recipes = recipes.map(({ id, title, image, missedIngredients, usedIngredients }) => {
      missedIngredients = missedIngredients.map(({ original }) => original);
      usedIngredients = usedIngredients.map(({ original }) => original);
      return { id, title, image, missedIngredients, usedIngredients };
    });
    res.locals.recipes = recipes;
    console.log({recipes})
    
    console.log('stored recipes on res.locals')


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

// get recipe information
// GET https://api.spoonacular.com/recipes/informationBulk

ingredientController.getRecipeInformation = async (req, res, next) => {
  console.log('getting recipe information');
  
  try {
    // get recipe ids
    const recipes = res.locals.recipes;

    const idQueryStrings = []
    // iterate through recipes recieved and add them to the query string
    recipes.forEach((recipe, i) => {
      // console.log({i})
      // console.log('recipe id ', recipe.id)
      idQueryStrings.push(recipe.id)
    })
    // console.log({ idQueryStrings })
    // turn query array into string with proper formating
    const stringifiedQueryIDs = idQueryStrings.join(',')
    // console.log(stringifiedQueryIDs)

    // fetch data with query
    const fetchedData = await fetch(`${spoonacular}/recipes/informationBulk/${apiKey}&ids=${stringifiedQueryIDs}`)
    // parse the data and set it equal to a variable
    const parsedData = await fetchedData.json();
    console.log(parsedData)
    // save parsed information onto res.locals
    res.locals.recipeInformation = parsedData
    
    return next()

  } catch (err) {
    return next(
      createError({
        method: 'getRecipeInformation',
        type: 'API query',
        status: 404, //404 = NOT FOUND or request not exist on API server
        err
      })
    )
  }

}


module.exports = ingredientController;
