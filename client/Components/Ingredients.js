import React, { useState, useEffect } from 'react';
import ingredientList from '../assets/ingredientList.js';
import RecipesList from './RecipesList.js';

const Ingredients = ({ setErrorMessage }) => {
  //array of strings to send to back end
  const [ingredients, setIngredients] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [textMatches, setTextMatches] = useState([]);
  // we need to pass fetched recipes to child component -> RecipesList -> starting state is null, so nothing will render
  const [fetchedRecipes, setFetchedRecipes] = useState(null);
  //When Get Your Recipe is clicked, this will turn to true and render a message to wait for recipe to be fetched
  const [waitForFetchRecipe, setWaitForFetchRecipe] = useState(false);

  // ---------SEARCH BOX (client entering string)-------------

  const onTextChange = (str) => {
    // create an empty array to store the matching ingredients
    let matches = [];
    if (str.length > 0) {
      // filter the ingredientList to only ingredient containing the search str & not in the selected ingredients
      matches = ingredientList.filter(
        (ingredient) =>
          ingredient.toLowerCase().includes(str.toLowerCase()) && !ingredients.includes(ingredient)
      );
    }
    //showing clients list of first 10 matching ingredients during search
    setTextMatches(matches.slice(0, 10));
    //show in search box what is typed
    setSearchText(str);
  };

  //Remove error message about login required when searchbox is used
  useEffect(() => {
    setErrorMessage(null);
  }, [textMatches]);

  //---------LIST OF PARTIALLY MATCHED INGREDIENTS-----------

  const renderTextMatches = () => {
    // if there are no text matches, return null
    if (textMatches.length === 0) return null;
    // otherwise, make a list with a list item for each matching ingredient
    return (
      <ul>
        {textMatches.map((ingredient, i) => (
          <li key={i}>
            <button className='button' onClick={() => selectIngredient(ingredient)}>{ingredient}</button>
          </li>
        ))}
      </ul>
    );
  };

  //--------------ADD & REMOVE TO LIST OF INGREDIENTS ON HAND--------------

  // function to add ingredient to selected ingredients list when clicked
  const selectIngredient = (ingredient) => {
    // only add ingredient if not already included
    // if (!ingredients.includes(ingredient)) {
    //   setIngredients([...ingredients, ingredient]);
    // }
    //Add ingredients to the list:
    setIngredients([...ingredients, ingredient]);
  };
  //After update selected ingredients, update the renderedlist
  useEffect(() => {
    onTextChange(searchText);
  }, [ingredients]);

  //function to remove ingredient added from list - pressing x
  const removeIngredient = (ingredient) => {
    setIngredients(
      ingredients.filter((el) => {
        return el !== ingredient;
      })
    );
  };

  //--------------AFTER SUBMITTING THE SELECTED INGREDIENTS---------

  const handleSubmit = (e) => {
    // reset the recipe list to null
    e.preventDefault();
    setFetchedRecipes(null);
    getRecipes(e);
  };

  //------------FETCH CALL TO GRAB RECIPES-------------

  const getRecipes = (e) => {
    //Obtain the submit button & disable it for 5s to avoid duplicate fetch request
    const submitButton = e.target.querySelector('.submitButton');
    submitButton.disabled = true;
    setTimeout(() => (submitButton.disabled = false), '5000');
    //Set waiting for fetch recipe to true:
    setWaitForFetchRecipe(true);
    // send get request, query should be all ingredients joined with ',+'
    fetch(`/recipe/searchByIngredient?ingredients=${ingredients.join(',+')}`)
      .then((res) => res.json())
      .then((recipes) => {
        //Set waiting for fetch recipe to true:
        setWaitForFetchRecipe(false);
        // set FetchedRecipes state => this will cause RecipesList componenet to render
        setFetchedRecipes(recipes);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // TODO: should we reset the ingredients list to empty array after fetching, or have separate reset button?

  return (
    <div>
      <div className='searchContainer'>
        <h5 className='searchBox'>WHAT'S IN YOUR PANTRY?</h5>
        <input className='ingredientInput'
          type='text'
          onChange={(e) => onTextChange(e.target.value)}
          value={searchText}
        ></input>
        <form onSubmit={handleSubmit}>
          <button className='submitButton'>GET RECIPES!</button>
        </form>
      </div>

      <div className='ingredientsBox'>
      <div className='suggestedIngredients'>
      <h4 className='yourIngredients'>SUGGESTED:</h4>
        {renderTextMatches()}
        </div>
        <ul className='selectedIngredients'>
        <h4 className='yourIngredients'>YOUR INGREDIENTS:</h4>
          {ingredients.map((ingredient, i) => (
            <li key={i}>
              {ingredient}
              <button className='x' onClick={() => { removeIngredient(ingredient)}}>⨉</button>
            </li>
          ))}
        </ul>
        </div>
        <div className='ingredientsBox'>
        <div className='foundRecipes'>
          <RecipesList recipes={fetchedRecipes} />
      </div>
      </div>
    </div>
  );
};

export default Ingredients;
