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
            <button onClick={() => selectIngredient(ingredient)}>{ingredient}</button>
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
    getRecipes();
  };

  //------------FETCH CALL TO GRAB RECIPES-------------

  const getRecipes = () => {
    // send get request, query should be all ingredients joined with ',+'
    fetch(`/recipe/searchByIngredient?ingredients=${ingredients.join(',+')}`)
      .then((res) => {
        if (res.ok) return res.json();
        else return null;
      })
      .then((data) => {
        // set FetchedRecipes state => this will cause RecipesList componenet to render
        setFetchedRecipes(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // TODO: should we reset the ingredients list to empty array after fetching, or have separate reset button?

  return (
    <div className='renderedComponent'>
      <div className='searchBox'>
        <h6>search box</h6>
        <input
          type='text'
          onChange={(e) => onTextChange(e.target.value)}
          value={searchText}
        ></input>
      </div>

      <div className='suggestedIngredients'>{renderTextMatches()}</div>
      <div className='selectedIngredients'>
        <h6>your ingredients</h6>
        <ul>
          {ingredients.map((ingredient, i) => (
            <li key={i}>
              {ingredient}
              <button
                onClick={() => {
                  removeIngredient(ingredient);
                }}
              >
                x
              </button>
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={handleSubmit}>
        <button className='submitButton'>Get Your Recipes</button>
      </form>
      <RecipesList recipes={fetchedRecipes} />
    </div>
  );
};

export default Ingredients;
