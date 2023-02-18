import React, { useState, useEffect } from 'react';
import ingredientList from '../assets/ingredientList.js';
import RecipesList from './RecipesList.js';

const Ingredients = () => {
  //array of strings to send to back end
  const [ingredients, setIngredients] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [textMatches, setTextMatches] = useState([]);

  // ---------SEARCH BOX (client entering string)-------------

  const onTextChange = (str) => {
    // create an empty array to store the matching ingredients
    let matches = [];
    if (str.length > 0) {
      // filter the ingredientList to only ingredient containing the search str
      matches = ingredientList.filter((ingredient) =>
        ingredient.toLowerCase().includes(str.toLowerCase())
      );
    }
    //showing clients list of matching ingredients during search
    setTextMatches(matches);
    //show in search box what is typed
    setSearchText(str);
  };

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
    if (!ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
    }
  };

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
    e.preventDefault();
    // send request
    // do something with data - pass to another component that displays matching recipes
    // reset the ingredients state to empty array
  };

  return (
    <div className='renderedComponent'>
      <form onSubmit={handleSubmit}>
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
      </form>
    </div>
  );
};

export default Ingredients;
