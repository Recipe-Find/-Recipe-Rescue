const express = require('express');
const router = express.Router();
const { saveRecipe } = require('../controllers/favoriteRecipeController');

router.post('/', saveRecipe, ((req, res ) => {
    console.log('at save rec router')
    res.status(200).json(res.locals.savedRecipe);
}))

module.exports = router;