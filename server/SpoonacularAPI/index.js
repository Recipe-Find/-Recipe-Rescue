// const apiKey = '?apiKey=187c3ad81cea4a6982c837f104b84bed';
// const apiKey = '?apiKey=c7fbf64aa2f94b16bfa3fabad11d9df8';
const apiKey='?apiKey=8fd086938ca040f1ab2a978f0f668ad0';

const spoonacular = 'https://api.spoonacular.com';
const numOfRecipes = 20;
//Rank to minimize missed ingredients => 2
const minMissedIng = 2;

module.exports = { apiKey, spoonacular, numOfRecipes, minMissedIng };
