import React from 'react';

// recipes -> [ { id, title, image, missedIngredients, usedIngredients, sourceURL } ];
const RecipesList = (props) => {
  // function to favorite a recipe
  const saveRecipe = (recipe) => {
    fetch('/favoriteRecipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/JSON'
      },
      body: JSON.stringify({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        sourceURL: recipe.sourceURL
      })
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  };

  if (!props.recipes) return null;
  else
    return (
      <div className='mainContainer'>
        <ul className='recipesList'>
          {props.recipes.map((recipe) => (
            <li key={recipe.id}>
              <button className='heartbutton' type='button' onClick={() => saveRecipe(recipe)}>
              ♡
              </button>
              <a className='recipeLink' href={recipe.sourceURL}>{recipe.title}</a><br/>
              <img style={{borderRadius: 10, margin: 5}} src={recipe.image} alt={recipe.title} /><br/>
              <div>MISSING INGREDIENTS: {recipe.missedIngredients.join(', ')}</div><br/>
              <h4>-------------------------------------------------------</h4>
            </li>
          ))}
        </ul>
      </div>
    );
};

export default RecipesList;
