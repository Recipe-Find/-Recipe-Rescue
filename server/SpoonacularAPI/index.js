// const apiKey = '?apiKey=187c3ad81cea4a6982c837f104b84bed';
// const apiKey = '?apiKey=c7fbf64aa2f94b16bfa3fabad11d9df8';
// const apiKey='?apiKey=8fd086938ca040f1ab2a978f0f668ad0';
const apiKey='?apiKey=9f6d532e32144e79a44a4cbee8c4ba82';

const spoonacular = 'https://api.spoonacular.com';
const numOfRecipes = 20;
//to minimize missed ingredients => 2
//to maximize used ingredients -> 1
const minMissedIng = 1;


module.exports = { apiKey, spoonacular, numOfRecipes, minMissedIng };
