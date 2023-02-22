const fs = require('fs/promises');
const fsCallback = require('fs');
const path = require('path');

const fileController = {}

fileController.checkStoredRecipes = async (req, res, next) => {
  console.log('getting stored recipes')
  try {
    // get stored recipes from cache
  const storedRecipes = await fsCallback.readFile(path.resolve(__dirname, '../data/storedRecipes.json'),  'UTF-8')
  // parse stored recipes
    const parsedRecipes = JSON.parse(storedRecipes);
    console.log({parsedRecipes})
    // place stored recipes on res.locals
    res.locals.parsedRecipes = parsedRecipes.results;
    return next();
  } catch (err) {
    return next(err);
  }
 
}

fileController.storeRecipe = async (req, res, next) => {
  console.log('storing recipe')

  try {

  } catch (err) {

  }

}