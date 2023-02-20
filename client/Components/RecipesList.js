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
      <div>
        <ul>
          {props.recipes.map((recipe) => (
            <li key={recipe.id}>
              <button type='button' onClick={() => saveRecipe(recipe)}>
                {'<3'}
              </button>
              <a href={recipe.sourceURL}>{recipe.title}</a>
              <img src={recipe.image} alt={recipe.title} />
              <div>missing ingredients: {recipe.missedIngredients.join(', ')}</div>
            </li>
          ))}
        </ul>
      </div>
    );
};

export default RecipesList;
