const express = require('express');
const router = express.Router();
const { saveRecipe, getRecipes } = require('../controllers/favoriteRecipeController');

// post request to db to add favorite recipes
router.post('/', saveRecipe, (req, res) => {
  console.log('at save rec router');
  res.status(200).json(res.locals.savedRecipe);
});

// get request to data base to show all reciepes in db
router.get('/', getRecipes, (req, res, next) => {
  console.log('get recipes');
  res.status(200).json(res.locals.recipes);
});

module.exports = router;
