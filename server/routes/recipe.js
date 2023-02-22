const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientController');
const { getRecipeURLByID } = require('../controllers/recipeController');

router.get('/searchByIngredient', [ingredientController.getRecipeByIngredient, ingredientController.getRecipeInformation , getRecipeURLByID] ,(req, res) => {
  res.status(200).send(res.locals)
});

module.exports = router;
