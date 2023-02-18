const express = require('express');
const router = express.Router();
const { getRecipeByIngredient } = require('../controllers/ingredientController');
const { getRecipeURLByID } = require('../controllers/recipeController');

router.get('/', getRecipeByIngredient, getRecipeURLByID, (req, res) => {
  res.status(200).send(res.locals.recipes);
});

module.exports = router;
