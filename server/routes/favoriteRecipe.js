const express = require('express');
const router = express.Router();
const { saveRecipe, getRecipes, deleteRecipe } = require('../controllers/favoriteRecipeController');

// post request to db to add favorite recipes
router.post('/', saveRecipe, (req, res) => {
  console.log('save recipes');
  res.status(200).json({ message: 'Recipe Added', savedRecipe: res.locals.savedRecipe });
});

// get request to data base to show all reciepes in db
router.get('/', getRecipes, (req, res, next) => {
  console.log('get recipes');
  res.status(200).json(res.locals.faveRecipeInformation);
});

// delete request to data base to delete a favorite recipe
router.delete('/', deleteRecipe, (req, res, next) => {
  console.log('delete recipes');
  res.status(200).json(res.locals.faveRecipeInformation);
});
module.exports = router;
